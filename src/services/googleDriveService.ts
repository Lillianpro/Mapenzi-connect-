export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  iconLink?: string;
}

export interface DriveAbout {
  user?: {
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
  };
}

/**
 * List files from Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options?: {
    pageSize?: number;
    query?: string;
    mimeTypeFilter?: 'images' | 'audio' | 'all';
  }
): Promise<DriveFile[]> {
  const pageSize = options?.pageSize || 25;
  const queries: string[] = ['trashed = false'];

  if (options?.mimeTypeFilter === 'images') {
    queries.push("mimeType contains 'image/'");
  } else if (options?.mimeTypeFilter === 'audio') {
    queries.push("mimeType contains 'audio/'");
  }

  if (options?.query && options.query.trim()) {
    queries.push(`name contains '${options.query.replace(/'/g, "\\'")}'`);
  }

  const q = encodeURIComponent(queries.join(' and '));
  const fields = encodeURIComponent(
    'files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, size, createdTime, modifiedTime, iconLink)'
  );

  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&q=${q}&fields=${fields}&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Google Drive files: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Fetch information about current user and storage quota
 */
export async function getDriveAbout(accessToken: string): Promise<DriveAbout> {
  const fields = encodeURIComponent('user(displayName, emailAddress, photoLink), storageQuota(limit, usage, usageInDrive)');
  const res = await fetch(`https://www.googleapis.com/drive/v3/about?fields=${fields}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to retrieve Drive profile details');
  }

  return res.json();
}

/**
 * Fetch a file's media as a Blob URL (useful for displaying private Drive images)
 */
export async function fetchDriveMediaUrl(accessToken: string, fileId: string): Promise<string> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load Drive file content: ${res.statusText}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Upload a file (photo or JSON backup) to Google Drive
 */
export async function uploadToDrive(
  accessToken: string,
  fileBlob: Blob,
  fileName: string,
  mimeType: string,
  description = 'Uploaded via Mapenzi Connect East Africa'
): Promise<DriveFile> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: description,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaPartHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  // Convert Blob to ArrayBuffer
  const fileArrayBuffer = await fileBlob.arrayBuffer();

  const metadataBuffer = new TextEncoder().encode(metadataPart);
  const mediaPartHeaderBuffer = new TextEncoder().encode(mediaPartHeader);
  const closeDelimiterBuffer = new TextEncoder().encode(closeDelimiter);

  const combined = new Uint8Array(
    metadataBuffer.byteLength +
      mediaPartHeaderBuffer.byteLength +
      fileArrayBuffer.byteLength +
      closeDelimiterBuffer.byteLength
  );

  let offset = 0;
  combined.set(metadataBuffer, offset);
  offset += metadataBuffer.byteLength;
  combined.set(mediaPartHeaderBuffer, offset);
  offset += mediaPartHeaderBuffer.byteLength;
  combined.set(new Uint8Array(fileArrayBuffer), offset);
  offset += fileArrayBuffer.byteLength;
  combined.set(closeDelimiterBuffer, offset);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload to Google Drive failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Backup user profile and conversation records to Google Drive as JSON
 */
export async function backupDataToDrive(
  accessToken: string,
  profile: any,
  matches: any[]
): Promise<DriveFile> {
  const backupPayload = {
    appName: 'Mapenzi Connect East Africa',
    version: '2.4.0',
    backupDate: new Date().toISOString(),
    userProfile: profile,
    matchesSummary: matches.map((m) => ({
      matchId: m.matchId,
      partnerName: m.user?.name,
      partnerCity: m.user?.city,
      partnerTribe: m.user?.tribe,
      matchedAt: m.matchedAt,
      isRespectMatch: m.isRespectMatch,
      lastMessage: m.lastMessage,
    })),
    culturalSettings: {
      dowryIntention: profile.dowryIntention,
      chaperoneEnabled: profile.chaperone?.enabled,
      chaperoneName: profile.chaperone?.name,
    },
  };

  const jsonString = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const fileName = `MapenziConnect_Backup_${profile.name?.replace(/\s+/g, '_') || 'User'}_${new Date().toISOString().slice(0, 10)}.json`;

  return uploadToDrive(accessToken, blob, fileName, 'application/json', 'Mapenzi Connect Secure Cloud Backup');
}

/**
 * Delete a file from Google Drive.
 * WARNING: Calling component MUST obtain explicit user confirmation first.
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file from Google Drive: ${res.statusText}`);
  }

  return true;
}

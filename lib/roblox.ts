const ROBLOX_API_BASE = 'https://apis.roblox.com'

interface RobloxAssetUploadResult {
  assetId: string
  operationId: string
}

interface RobloxOperationResult {
  done: boolean
  response?: {
    assetId: string
    assetVersionNumber: number
  }
  error?: {
    code: number
    message: string
  }
}

/**
 * Validate that an API key has the required permissions
 */
export async function validateRobloxApiKey(
  apiKey: string,
  userId: string
): Promise<{ valid: boolean; username?: string; error?: string }> {
  try {
    // Try to fetch user info - this validates the key works
    const res = await fetch(
      `https://users.roblox.com/v1/users/${userId}`,
      { headers: { 'x-api-key': apiKey } }
    )

    if (!res.ok) {
      return { valid: false, error: 'Invalid API key or user ID' }
    }

    const data = await res.json()
    return { valid: true, username: data.displayName || data.name }
  } catch {
    return { valid: false, error: 'Failed to connect to Roblox API' }
  }
}

/**
 * Upload an audio file to Roblox via Open Cloud API
 */
export async function uploadAudioToRoblox(params: {
  apiKey: string
  userId: string
  groupId?: string
  audioBuffer: Buffer
  fileName: string
  displayName: string
}): Promise<RobloxAssetUploadResult> {
  const { apiKey, userId, groupId, audioBuffer, fileName, displayName } = params

  const creatorType = groupId ? 'Group' : 'User'
  const creatorId = groupId || userId

  // Create form data
  const FormData = (await import('form-data')).default
  const form = new FormData()

  form.append(
    'request',
    JSON.stringify({
      assetType: 'Audio',
      displayName,
      description: `Uploaded via CENZ STUDIO`,
      creationContext: {
        creator: {
          userId: creatorType === 'User' ? creatorId : undefined,
          groupId: creatorType === 'Group' ? creatorId : undefined,
        },
      },
    }),
    { contentType: 'application/json' }
  )

  form.append('fileContent', audioBuffer, {
    filename: fileName,
    contentType: 'audio/mpeg',
  })

  const res = await fetch(`${ROBLOX_API_BASE}/assets/v1/assets`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      ...form.getHeaders(),
    },
    body: form as unknown as BodyInit,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Roblox upload failed: ${res.status} - ${err}`)
  }

  const data = await res.json()
  return {
    assetId: data.assetId || '',
    operationId: data.operationId || data.path || '',
  }
}

/**
 * Poll operation status until done
 */
export async function pollRobloxOperation(
  apiKey: string,
  operationId: string,
  maxAttempts = 30
): Promise<RobloxOperationResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000)) // Wait 2s between polls

    const res = await fetch(
      `${ROBLOX_API_BASE}/assets/v1/${operationId}`,
      { headers: { 'x-api-key': apiKey } }
    )

    if (!res.ok) continue

    const data: RobloxOperationResult = await res.json()
    if (data.done) return data
  }

  return { done: false, error: { code: 408, message: 'Operation timed out' } }
}

/**
 * Get moderation status of a Roblox asset
 */
export async function getAssetModerationStatus(
  apiKey: string,
  assetId: string
): Promise<'PENDING' | 'ACCEPTED' | 'REJECTED'> {
  try {
    const res = await fetch(
      `${ROBLOX_API_BASE}/assets/v1/assets/${assetId}`,
      { headers: { 'x-api-key': apiKey } }
    )

    if (!res.ok) return 'PENDING'

    const data = await res.json()
    const state = data.moderationResult?.moderationState

    if (state === 'Approved') return 'ACCEPTED'
    if (state === 'Rejected') return 'REJECTED'
    return 'PENDING'
  } catch {
    return 'PENDING'
  }
}

export function getAvatarPath(avatarPath: string) {
  return `${import.meta.env.VITE_API_URL}${avatarPath}`
}
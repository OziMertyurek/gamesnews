import { getCurrentAccessToken } from './auth'
import { getUserProfileExtras, type GameComment } from './community'

async function callMePublicData(body: Record<string, unknown>) {
  const token = await getCurrentAccessToken()
  if (!token) return

  await fetch('/api/me-public-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).catch(() => undefined)
}

export async function syncPublicExtras(email: string) {
  const extras = getUserProfileExtras(email)
  await callMePublicData({
    op: 'upsert_extras',
    steamProfileUrl: extras.steamProfileUrl,
    playedGameSlugs: extras.playedGameSlugs,
    steamGames: extras.steamGames,
  })
}

export async function syncPublicCommentAdd(comment: GameComment) {
  await callMePublicData({
    op: 'add_comment',
    gameSlug: comment.gameSlug,
    rating: comment.rating,
    content: comment.content,
  })
}

export async function syncPublicCommentDelete(commentId: string) {
  await callMePublicData({
    op: 'delete_comment',
    commentId,
  })
}

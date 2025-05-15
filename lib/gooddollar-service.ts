/**
 * GoodDollar Token Service
 *
 * This service handles interactions with the GoodDollar token system
 * for rewarding users with G$ tokens.
 */

// Types for rewards
export interface Reward {
  id: string
  title: string
  description: string
  points: number
  tokenAmount: number
}

export interface UserRewards {
  userId: string
  points: number
  claimedRewards: string[]
}

// Mock database for development
const userRewardsDB: Record<string, UserRewards> = {}

/**
 * Get user rewards data
 */
export async function getUserRewards(userId: string): Promise<UserRewards> {
  // In production, fetch from your database
  if (!userRewardsDB[userId]) {
    userRewardsDB[userId] = {
      userId,
      points: 100, // Starting points
      claimedRewards: [],
    }
  }

  return userRewardsDB[userId]
}

/**
 * Add points to user account
 */
export async function addUserPoints(userId: string, points: number): Promise<UserRewards> {
  const userData = await getUserRewards(userId)
  userData.points += points

  // In production, update your database
  userRewardsDB[userId] = userData

  return userData
}

/**
 * Claim a reward with GoodDollar tokens
 */
export async function claimGoodDollarReward(
  userId: string,
  rewardId: string,
  pointsCost: number,
  tokenAmount: number,
): Promise<{ success: boolean; message: string; userData?: UserRewards }> {
  try {
    const userData = await getUserRewards(userId)

    // Check if user has enough points
    if (userData.points < pointsCost) {
      return {
        success: false,
        message: "Not enough points to claim this reward",
      }
    }

    // Check if reward was already claimed
    if (userData.claimedRewards.includes(rewardId)) {
      return {
        success: false,
        message: "Reward already claimed",
      }
    }

    // In production, integrate with GoodDollar API or smart contract
    // to transfer tokens to the user's wallet
    // const transferResult = await transferGoodDollarTokens(userWalletAddress, tokenAmount);

    // Update user data
    userData.points -= pointsCost
    userData.claimedRewards.push(rewardId)

    // In production, update your database
    userRewardsDB[userId] = userData

    return {
      success: true,
      message: `Successfully claimed ${tokenAmount} G$ tokens!`,
      userData,
    }
  } catch (error) {
    console.error("Error claiming GoodDollar reward:", error)
    return {
      success: false,
      message: "Failed to process reward. Please try again later.",
    }
  }
}

/**
 * Get available rewards
 */
export function getAvailableRewards(): Reward[] {
  return [
    {
      id: "gooddollar-5",
      title: "5 GoodDollar Tokens",
      description: "Claim 5 G$ tokens for your participation",
      points: 100,
      tokenAmount: 5,
    },
    {
      id: "gooddollar-10",
      title: "10 GoodDollar Tokens",
      description: "Claim 10 G$ tokens for being an active voter",
      points: 250,
      tokenAmount: 10,
    },
    {
      id: "gooddollar-25",
      title: "25 GoodDollar Tokens",
      description: "Claim 25 G$ tokens for your valuable contributions",
      points: 500,
      tokenAmount: 25,
    },
  ]
}

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      state
      availableEmotions
      images {
        items {
          id
          owner
          targetEmotion
          fileName
          detectedEmotion
          confidence
          faceDetails
          createdAt
          updatedAt
        }
        nextToken
      }
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        state
        availableEmotions
        images {
          nextToken
        }
        status
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
      id
      owner
      targetEmotion
      fileName
      detectedEmotion
      confidence
      faceDetails
      game {
        id
        state
        availableEmotions
        images {
          nextToken
        }
        status
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        targetEmotion
        fileName
        detectedEmotion
        confidence
        faceDetails
        game {
          id
          state
          availableEmotions
          status
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStats = /* GraphQL */ `
  query GetStats($id: ID!) {
    getStats(id: $id) {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listStatss = /* GraphQL */ `
  query ListStatss(
    $filter: ModelStatsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        wins
        losses
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const searchImages = /* GraphQL */ `
  query SearchImages(
    $filter: SearchableImageFilterInput
    $sort: SearchableImageSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchImages(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        targetEmotion
        fileName
        detectedEmotion
        confidence
        faceDetails
        game {
          id
          state
          availableEmotions
          status
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;

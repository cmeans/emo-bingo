/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
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
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
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
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
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
export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $input: CreateImageInput!
    $condition: ModelImageConditionInput
  ) {
    createImage(input: $input, condition: $condition) {
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
export const updateImage = /* GraphQL */ `
  mutation UpdateImage(
    $input: UpdateImageInput!
    $condition: ModelImageConditionInput
  ) {
    updateImage(input: $input, condition: $condition) {
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
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage(
    $input: DeleteImageInput!
    $condition: ModelImageConditionInput
  ) {
    deleteImage(input: $input, condition: $condition) {
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
export const createStats = /* GraphQL */ `
  mutation CreateStats(
    $input: CreateStatsInput!
    $condition: ModelStatsConditionInput
  ) {
    createStats(input: $input, condition: $condition) {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateStats = /* GraphQL */ `
  mutation UpdateStats(
    $input: UpdateStatsInput!
    $condition: ModelStatsConditionInput
  ) {
    updateStats(input: $input, condition: $condition) {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteStats = /* GraphQL */ `
  mutation DeleteStats(
    $input: DeleteStatsInput!
    $condition: ModelStatsConditionInput
  ) {
    deleteStats(input: $input, condition: $condition) {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;

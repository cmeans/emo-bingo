/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame($owner: String!) {
    onCreateGame(owner: $owner) {
      id
      state
      images {
        items {
          id
          targetEmotion
          fileName
          detectedEmotion
          confidence
          faceDetails
          createdAt
          updatedAt
          owner
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
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame($owner: String!) {
    onUpdateGame(owner: $owner) {
      id
      state
      images {
        items {
          id
          targetEmotion
          fileName
          detectedEmotion
          confidence
          faceDetails
          createdAt
          updatedAt
          owner
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
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame($owner: String!) {
    onDeleteGame(owner: $owner) {
      id
      state
      images {
        items {
          id
          targetEmotion
          fileName
          detectedEmotion
          confidence
          faceDetails
          createdAt
          updatedAt
          owner
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
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage($owner: String!) {
    onCreateImage(owner: $owner) {
      id
      targetEmotion
      fileName
      detectedEmotion
      confidence
      faceDetails
      game {
        id
        state
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
      owner
    }
  }
`;
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage($owner: String!) {
    onUpdateImage(owner: $owner) {
      id
      targetEmotion
      fileName
      detectedEmotion
      confidence
      faceDetails
      game {
        id
        state
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
      owner
    }
  }
`;
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage($owner: String!) {
    onDeleteImage(owner: $owner) {
      id
      targetEmotion
      fileName
      detectedEmotion
      confidence
      faceDetails
      game {
        id
        state
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
      owner
    }
  }
`;
export const onCreateStats = /* GraphQL */ `
  subscription OnCreateStats {
    onCreateStats {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateStats = /* GraphQL */ `
  subscription OnUpdateStats {
    onUpdateStats {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteStats = /* GraphQL */ `
  subscription OnDeleteStats {
    onDeleteStats {
      id
      wins
      losses
      createdAt
      updatedAt
      owner
    }
  }
`;

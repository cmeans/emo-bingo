/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEntry = /* GraphQL */ `
  query GetEntry($id: ID!) {
    getEntry(id: $id) {
      id
      name
      note
      image
      faces
      emotions
      emotion
      confidence
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listEntrys = /* GraphQL */ `
  query ListEntrys(
    $filter: ModelEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        note
        image
        faces
        emotions
        emotion
        confidence
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;

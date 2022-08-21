import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
      bookCount
      password
      email
      username
      _id
    }
  }
`;

import gql from 'graphql-tag';

const faviconFields = gql`
  fragment faviconFields on Asset {
    url
    mimeType
   }
`;

// XXX https://www.apollographql.com/docs/react/advanced/fragments
export const favicon = {
  faviconFields
};

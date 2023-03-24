const toNodefields = `
  node_id
  node_type
  propertyKeys {
    node_property_key_id
    property_key
    values {
      property_value {
        value
      }
      upVotes
      downVotes
      posts {
        id
      }
    }
  }
`;

export const buildNodesByNodeTypeQuery = (node_type: string) => `
  query {
    nodesByNodeType(node_type: "${node_type}") {
      ${toNodefields}
      nestedRelationships {
        toNode {
          ${toNodefields}
          nestedRelationships {
            toNode {
              ${toNodefields}
              nestedRelationships {
                toNode {
                  ${toNodefields}
                  nestedRelationships {
                    toNode {
                      ${toNodefields}
                      nestedRelationships {
                        toNode {
                          ${toNodefields}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const buildCreateNodePropertyValueMutation = (
  node_property_key_id: number,
  property_value: string,
) => `
  mutation {
    createNodePropertyValue(createNodePropertyValueInput: {
      node_property_key_id: ${node_property_key_id},
      property_value: "${property_value}",
    }) {
      node_property_value_id
    }
  } 
`;

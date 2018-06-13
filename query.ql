{
  entities {
    id
    name
    type
    ... on Person {
      age
    }
    ... on Location {
      address {
        line1
        line2
        city
        state
        postalCode
      }
    }
    ... on Team {
      teamLead {
        id
        name
        type
        age
      }
      fullTimeMembers {
        id
        name
        type
        age
      }
      interns {
        id
        name
        type
        age
      }
      office {
        id
        name
        type
        address {
          line1
          line2
          city
          state
          postalCode
        }
      }
    }
    ... on Event {
      description
      team {
        name
      }
      location {
        name
      }
    }
  }
  count
}
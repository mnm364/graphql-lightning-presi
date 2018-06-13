{
  entities {
    id
    name
    type
    ... wholePerson
    ... wholeLocation
    ... wholeTeam
    ... on Event {
      description
      team {
        ... wholeTeam
      }
      location {
        name
      }
    }
  }
}

fragment wholePerson on Person {
  id
  name
  type
  age
}

fragment wholeLocation on Location {
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

fragment wholeTeam on Team {
  teamLead {
    ... wholePerson
  }
  fullTimeMembers {
    ... wholePerson
  }
  interns {
    ... wholePerson
  }
  office {
    ... wholeLocation
  }
}
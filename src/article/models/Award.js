import { DocumentNode, STRING } from 'substance'

export default class Award extends DocumentNode {}
Award.schema = {
  type: 'award',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
}

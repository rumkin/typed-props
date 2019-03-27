import {StrictType as T} from 'typed-props'

let userType
let postType

userType = T.exact({
  id: T.number,
  username: T.string,
  email: T.string,
  balance: T.number,
  // Posts has author which type is User
  posts: () => postType,
})

postType = T.exact({
  title: T.string,
  starts: T.number,
  // Author has type User which has posts
  author: () => userType,
})

function typeIs(type) {
  return ({$type}) => $type === type
}

export default T.select(
  [typeIs('http://api.rumk.in/v1#user'), userType],
  [typeIs('http://api.rumk.in/v1#post'), postType],
)
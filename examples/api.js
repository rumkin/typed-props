import {StrictType as T} from 'typed-props'

let userType
let postType
let commentType

userType = T.exact({
  $type: T.is('http://api.rumk.in/v1#user'),
  id: T.number,
  username: T.string,
  email: T.string,
  balance: T.number,
  // Posts is an array. Each post has an author which type is User
  posts: () => T.arrayOf(postType),
})

postType = T.exact({
  $type: T.is('http://api.rumk.in/v1#post'),
  id: T.number,
  title: T.string,
  text: T.string,
  stars: T.number,
  // Author has type User which has posts
  author: () => userType,
  // Comments property is an array It has reference to the post type
  comments: () => T.arrayOf(commentType),
  publishedAt: T.instanceOf(Date),
})

commentType = T.exact({
  $type: T.is('http://api/rumk.in/v1#comment'),
  id: T.number,
  text: T.string,
  stars: T.number,
  author: () => userType,
  publishedAt: T.instanceOf(Date),
})

function typeIs(type) {
  return ({$type}) => $type === type
}

export default T.select(
  [typeIs('http://api.rumk.in/v1#user'), userType],
  [typeIs('http://api.rumk.in/v1#post'), postType],
  [typeIs('http://api.rumk.in/v1#comment'), commentType],
)
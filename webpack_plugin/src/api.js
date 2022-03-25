import $ from 'jquery'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import { ajax } from './utils.js'

// 撈新留言
export function getNewComments(apiUrl, siteKey, count, limit, isShow = true, cb) {
  const ERROR = 'Connection Error'
  const url = `${apiUrl}api_get_comment.php?site_key=${siteKey}&offset=${count * 5}&limit=${limit}`
  ajax(url, 'GET', null, (res, error) => {
    if (error) {
      cb(error, null)
      return
    }
    if (!res.ok) {
      cb(res.message, null)
      return
    }
    const comments = res.discussions
    cb(null, comments)
  })
}

// 撈所有留言
export function getAllComments(apiUrl, siteKey, cb) {
  const url = `${apiUrl}api_get_comment.php?site_key=${siteKey}`
  ajax(url, 'GET', null, (res, error) => {
    if (error) {
      cb(error)
      return
    }
    if (!res.ok) {
      cb(res.message)
      return
    }
    const comments = res.discussions
    cb(null, comments)
  })
}

// 新增留言
export function addComment(apiUrl, data, cb) {
  const siteKey = data.site_key
  const url = `${apiUrl}api_add_comment.php`
  ajax(url, 'POST', data, (res, error) => {
    if (error) {
      cb(error)
      return
    }
    if (!res.ok) {
      cb(res.message)
      return
    }
    cb(null)
  })
}

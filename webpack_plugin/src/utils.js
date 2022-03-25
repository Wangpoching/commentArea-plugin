import $ from 'jquery'
import { getLoadMore } from './templates.js'

// 逃脫字元
export function escape(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  const reg = /[&<>"'/]/ig
  return string.replace(reg, (match) => (map[match]))
}

// 現在時間（ 新增留言 )
export function date() {
  const today = new Date()
  const date = `${today.getFullYear()}-'${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
  const dateTime = `${date} ${time}`
  return dateTime
}

// XHR
export function ajax(url, method, data, cb) {
  $.ajax({
    type: method,
    url,
    ...(data && { data })
  }).done((res) => {
    cb(res, null)
  }).fail((error) => {
    cb(null, error)
  })
}

// 添加留言到 DOM
export function addComment2DOM(container, {nickname, createdAt, content}, id, isAppend = true, apper = true) {
  const html = `
    <div class="col-8 comment mb-3 ${apper ? '' : 'hide'}">
      <div class="toast" data-id = "${id}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">${escape(nickname)}</strong>
          <small>${escape(createdAt)}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${escape(content)}
        </div>
      </div>
    </div>
  `
  isAppend ? container.append(html) : container.prepend(html)
}

// 增加按鈕
export function bindAddMore2Dom(container, className) {
  container.append(getLoadMore(className)) 
}

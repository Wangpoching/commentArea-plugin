/* eslint-env jquery */

// 起始參數
const ERROR = 'Connection Error'
const LIMIT = 5
const BASEURL = 'http://13.59.36.215//api_based_board/'
let count = 0
let hasComment = true
let isLoaded = false

// 逃脫字元
function escape(string) {
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

// 添加留言到 DOM
function addComment2DOM(container, {nickname, created_at, content}, id, isAppend = true, apper = true) {
  const html = `
    <div class="col-8 comment mb-3 ${apper ? '' : 'hide'}">
      <div class="toast" data-id = "${id}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">${escape(nickname)}</strong>
          <small>${escape(created_at)}</small>
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

// 現在時間（ 新增留言 )
function date() {
  const today = new Date()
  const date = `${today.getFullYear()}-'${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
  const dateTime = `${date} ${time}`
  return dateTime
}

// 增加按鈕
function bindAddMore2Dom() {
  $('.comments').append(`
    <div class="row justify-content-center my-3"><button class="btn btn-primary col-4 loadmore" type="button">載入更多</button></div>
  `)  
}


// XHR
function ajax(url, method, data, cb) {
  $.ajax({
    method,
    url,
    ...(data && { data })
  }).done((res) => {
    cb(null, res)
  }).fail((error) => {
    cb(error, null)
  })
}

$(document).ready(() => {
  // 撈留言
  let url = `${BASEURL}api_get_comment.php?site_key=boching&offset=${count * 5}&limit=${LIMIT}`
  ajax(url, 'GET', null, (error, res) => {
    if (error) {
      alert(ERROR)
      return
    }
    if (!res.ok) {
      alert(res.message)
      return
    }
    const comments = res.discussions
    if (!comments.length) {
      hasComment = false
      isLoaded = true
      return
    }
    for (const comment of comments) {
      addComment2DOM($('.comments'), comment, count, true, true)
    }
    // toast 元件
    $(`[data-id="${count}"].toast`).toast({ autohide: false })
    $(`[data-id="${count}"].toast`).toast('show')
    count += 1
    // 再撈留言（ 隱藏 ）
    url = `${BASEURL}api_get_comment.php?site_key=boching&offset=${count * 5}&limit=${LIMIT}`
    ajax(url, 'GET', null, (error, res) => {
      if (error) {
        alert(ERROR)
        isLoaded = true
        return
      }
      if (!res.ok) {
        alert(res.message)
        isLoaded = true
        return
      }
      const comments = res.discussions
      if (!comments.length) {
        hasComment = false
        isLoaded = true
        return
      }
      for (const comment of comments) {
        addComment2DOM($('.comments'), comment, count, true, false)
      }
      // toast 元件
      $(`[data-id="${count}"].toast`).toast({ autohide: false })
      $(`[data-id="${count}"].toast`).toast('show')
      isLoaded = true
      // 如果留言板高度 < 視窗高度，留言板的 size 改變就添加載入更多按鈕
      const main = document.querySelector('.main')
      const myObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if ($('.main').height() < $(window).height()) {
            if (!$('.loadmore').length && hasComment && isLoadec && $('.comment').length) {
              bindAddMore2Dom()
            }
          }
        })
      })
      myObserver.observe(main)
    })
  })

  // 防止按 Enter 送出表單
  $('.add-comment-form').submit((e) => {
    e.preventDefault()
  })

  // 新增留言
  $('.btn-submit').click((e) => {
    const data = {
      site_key: 'boching',
      nickname: $('input[name="nickname"]').val(),
      content: $('textarea[name="content"]').val(),
      created_at: date()
    }
    const url = `${BASEURL}api_add_comment.php`
    ajax(url, 'POST', data, (error, res) => {
      if (error) {
        alert(ERROR)
        return
      }
      if (!res.ok) {
        alert(res.message)
      } else {
        addComment2DOM($('.comments'), data, 'new', false, true)
        // toast 元件
        $('[data-id="new"].toast').toast({ autohide: false })
        $('[data-id="new"].toast').toast('show')
      }
      // 清空
      $('input[name="nickname"]').val('')
      $('textarea[name="content"]').val('')
    })
  })

  // 產生載入更多按鈕（ 滾到底前 100px 觸發 ）
  $(window).scroll(() => {
    if ($(document).height() - $(window).scrollTop() - $(window).height() < 100) {
      if (!$('.loadmore').length && hasComment && isLoaded) {
        bindAddMore2Dom()
      }
    }
  })

  // 載入更多
  $('.comments').on('click', '.loadmore', (e) => {
    $(e.target).parent().remove()
    isLoaded = false
    // 顯示留言
    $(`[data-id="${count}"].toast`).parent().removeClass('hide')
    // 撈留言（ 隱藏 )
    count += 1
    const url = `${BASEURL}api_get_comment.php?site_key=boching&offset=${count * 5}&limit=${LIMIT}`
    ajax(url, 'GET', null, (error, res) => {
      if (error) {
        alert(ERROR)
        return
      }
      if (!res.ok) {
        alert(res.message)
        return
      }
      const comments = res.discussions
      if (!comments.length) {
        hasComment = false
        isLoaded = true
        return
      }
      for (const comment of comments) {
        addComment2DOM($('.comments'), comment, count, true, false)
      }
      $(`[data-id="${count}"].toast`).toast({ autohide: false })
      $(`[data-id="${count}"].toast`).toast('show')
      isLoaded = true
    })
  })

  // 回到頂部
  $('.btn-gotop').click((e) => {
    $(window).scrollTop(0)
  })

  // 移至最底
  $('.btn-gobottom').click(() => {
    count = 0
    isLoaded = false
    hasComment = true
    $('.comments').empty()
    // 撈留言
    const url = `${BASEURL}api_get_comment.php?site_key=boching`
    ajax(url, 'GET', null, (error, res) => {
      if (error) {
        alert(ERROR)
        isLoaded = true
        return
      }
      if (!res.ok) {
        alert(res.message)
        isLoaded = true
        return
      }
      const comments = res.discussions
      if (!comments.length) {
        isLoaded = true
        hasComment = false
        return        
      }      
      if (comments.length) {
        for (const comment of comments) {
          addComment2DOM($('.comments'), comment, 'all', true, true)
        }
        // toast 元件
        $('[data-id="all"].toast').toast({ autohide: false })
        $('[data-id="all"].toast').toast('show')
      }
      hasComment = false
      isLoaded = true
      $(window).scrollTop($(document).height() - $(window).height())
    })
  })

  $('.comments').on('click', '.btn-close', (e) => {
    $(e.target).closest('.comment').addClass('hide')
  })
})

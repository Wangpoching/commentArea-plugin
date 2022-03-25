/* eslint-disable import/prefer-default-export */
import $ from 'jquery'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import { getNewComments, getAllComments, addComment } from './api.js'
import { date, addComment2DOM, bindAddMore2Dom } from './utils.js'
import { getAddCommentForm } from './templates.js'
import './bootstrap.min.css'
import './main.css'

window.bootstrap = bootstrap

// 初始化
export function init({siteKey, apiUrl, containerClassName}) {
  // 起始參數
  let count = 0
  let hasComment = true
  let isLoaded = false
  const LIMIT = 5
  const ERROR = 'Connection Error'

  const containerSelector = `.${containerClassName}`
  const loadMoreClassName = `${siteKey}-loadmore`
  const loadMoreSelector = `.${loadMoreClassName}`
  const commentsClassName = `${siteKey}-comments`
  const commentsSelector = `.${commentsClassName}`
  const addCommentFormClassName = `${siteKey}-add-comment-form`
  const addCommentFormSelector = `.${addCommentFormClassName}`
  const wrapperClassName = `${siteKey}-board__wrapper`
  const wrapperSelector = `.${wrapperClassName}`

  // 插入留言板 template
  $(containerSelector).append(getAddCommentForm(addCommentFormClassName, commentsClassName, wrapperClassName))
  // 載入留言
  getNewComments(apiUrl, siteKey, count, LIMIT, true, (error, comments) => {
    if (error) {
      alert(error)
      isLoaded = true
      return      
    }
    if (!comments.length) {
      hasComment = false
      isLoaded = true
      return
    }
    for (const comment of comments) {
      addComment2DOM($(commentsSelector), comment, count, true, true)
    }
    // toast 元件
    const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="${count}"].toast`))
    const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
    toastList.forEach((toast) => toast.show())
    count += 1
    getNewComments(apiUrl, siteKey, count, LIMIT, false, (error, comments) => {
      if (error) {
        alert(error)
        isLoaded = true
        return      
      }      
      if (!comments.length) {
        hasComment = false
        isLoaded = true
        return
      }
      for (const comment of comments) {
        addComment2DOM($(commentsSelector), comment, count, true, false)
      }
      // toast 元件
      const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="${count}"].toast`))
      const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
      toastList.forEach((toast) => toast.show())
      isLoaded = true
      // 如果留言板高度 < 視窗高度，留言板的 size 改變就添加載入更多按鈕
      const main = document.querySelector('.main')
      const myObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if ($(wrapperSelector).height() < $(containerSelector).height()) {
            if (!$(loadMoreSelector).length && hasComment  && isLoaded && $('.comment').length) {
              bindAddMore2Dom($(commentsSelector), loadMoreClassName)
            }
          }
        })
      })
      myObserver.observe(main)
    })
  })

  // 防止按 Enter 送出表單
  $(addCommentFormSelector).submit((e) => {
    e.preventDefault()
  })

  // 新增留言
  $(`${addCommentFormSelector} .btn-submit`).click((e) => {
    const nicknameElement = $(`${addCommentFormSelector} input[name="nickname"]`)
    const contentElement = $(`${addCommentFormSelector} textarea[name="content"]`)
    const data = {
      site_key: siteKey,
      nickname: nicknameElement.val(),
      content: contentElement.val(),
      created_at: date()
    }
    addComment(apiUrl, data, (error) => {
      if (error) {
        alert(error)
        return
      }
      addComment2DOM($(commentsSelector), data, 'new', false, true)
      // toast 元件
      const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="new"].toast`))
      const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
      toastList.forEach((toast) => toast.show())
      // 清空
      nicknameElement.val('')
      contentElement.val('')
    })
  })

  // 產生載入更多按鈕（ 滾到底前 100px 觸發 )
  function scrollListener() {
    const wrapperParent = document.querySelector(wrapperSelector).parentNode
    let parent = $(window)
    let children = $(document)
    // 測試是否有垂直滾動軸
    if (wrapperParent.scrollHeight > wrapperParent.clientHeight) {
      parent = $(wrapperParent)
      children = $(document.querySelector(wrapperSelector))
    }
    parent.scroll(() => {
      console.log(parent.scrollTop())
      if (children.height() - parent.scrollTop() - parent.height() < 100) {
        if (!$(loadMoreSelector).length && hasComment && isLoaded) {
          bindAddMore2Dom($(commentsSelector), loadMoreClassName)
        }
      }
    })
  }
  scrollListener()


  // 載入更多
  $(commentsSelector).on('click', loadMoreSelector, (e) => {
    $(e.target).parent().remove()
    isLoaded = false
    // 顯示留言
    $(`${commentsSelector} [data-id="${count}"].toast`).parent().removeClass('hide')
    // 撈留言（ 隱藏 ）
    count += 1
    getNewComments(apiUrl, siteKey, count, LIMIT, false, (error, comments) => {
      if (error) {
        alert(error)
        isLoaded = true
        return      
      } 
      if (!comments.length) {
        hasComment = false
        isLoaded = true
        return
      }
      for (const comment of comments) {
        addComment2DOM($(commentsSelector), comment, count, true, false)
      }
      // toast 元件
      const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="${count}"].toast`))
      const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
      toastList.forEach((toast) => toast.show())
      isLoaded = true
    })
  })

  // 刷新
  $(`${addCommentFormSelector} .btn-refresh`).click((e) => {
    e.preventDefault()
    $(commentsSelector).empty()
    count = 0
    isLoaded = false
    hasComment = true
    // 載入留言
    getNewComments(apiUrl, siteKey, count, LIMIT, true, (error, comments) => {
      if (error) {
        alert(error)
        isLoaded = true
        return        
      }
      if (!comments.length) {
        hasComment = false
        isLoaded = true
        return
      }
      for (const comment of comments) {
        addComment2DOM($(commentsSelector), comment, count, true, true)
      }
      // toast 元件
      const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="${count}"].toast`))
      const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
      toastList.forEach((toast) => toast.show())
      count += 1
      getNewComments(apiUrl, siteKey, count, LIMIT, false, (error, comments) => {
        if (error) {
          alert(error)
          isLoaded = true
          return        
        }
        if (!comments.length) {
          hasComment = false
          isLoaded = true
          return
        }
        for (const comment of comments) {
          addComment2DOM($(commentsSelector), comment, count, true, false)
        }
        // toast 元件
        const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="${count}"].toast`))
        const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
        toastList.forEach((toast) => toast.show())
        isLoaded = true
        // 如果留言板高度 < 視窗高度，留言板的 size 改變就添加載入更多按鈕
        const main = document.querySelector('.main')
        const myObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            if ($(wrapperSelector).height() < $(containerSelector).height()) {
              if (!$(loadMoreSelector).length && hasComment  && isLoaded && $('.comment').length) {
                bindAddMore2Dom($(commentsSelector), loadMoreClassName)
              }
            }
          })
        })
        myObserver.observe(main)
      })
    })
  })

  // 回到頂部
  $(`${wrapperSelector} .btn-gotop`).click((e) => {
    const wrapperParent = document.querySelector(wrapperSelector).parentNode
    // 測試是否有垂直滾動軸
    if (wrapperParent.scrollHeight > wrapperParent.clientHeight) {
      wrapperParent.scrollTop = 0
    } else {
      const currentScrollTop = $(window).scrollTop()
      const rect = wrapperParent.getBoundingClientRect()
      const scrollDistance = rect.top + currentScrollTop
      window.scroll(0, scrollDistance)
    }
  })

  // 移至最底
  $(`${wrapperSelector} .btn-gobottom`).click(() => {
    count = 0
    isLoaded = false
    hasComment = true
    const wrapperElement = document.querySelector(wrapperSelector)
    const wrapperParent = wrapperElement.parentNode
    $(commentsSelector).empty()
    getAllComments(apiUrl, siteKey, (error, comments) => {
      if (error) {
        alert(error)
        isLoaded = true
        return
      }
      if (!comments.length) {
        isLoaded = true
        hasComment = false
        return        
      }
      if (comments.length) {
        for (const comment of comments) {
          addComment2DOM($(commentsSelector), comment, 'all', true, true)
        }
        // toast 元件
        const toastElList = [].slice.call(document.querySelectorAll(`${commentsSelector} [data-id="all"].toast`))
        const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
        toastList.forEach((toast) => toast.show())
      }
      hasComment = false
      isLoaded = true

      // 測試是否有垂直滾動軸
      if (wrapperParent.scrollHeight > wrapperParent.clientHeight) {
        wrapperParent.scrollTop = wrapperElement.offsetHeight - wrapperParent.offsetHeight
      } else {
        const currentScrollTop = $(window).scrollTop()
        const rect = wrapperParent.getBoundingClientRect()
        const scrollDistance = rect.top + rect.height + currentScrollTop - window.innerHeight
        window.scroll(0, scrollDistance)
      }
    })
  })
}

# 留言板插件
webpack comment board plugin

用膩了 disqus 嗎? 來嘗嘗看新的留言板插件

## 使用方法
```
  <script defer src="main.js"></script> // 載入名為 commentPlugin 的插件
  <script>
    document.addEventListener('DOMContentLoaded',() => {
      commentPlugin.init({
        siteKey: 'boching', // 這裡可以為你的網站取一個 key
        apiUrl: 'http://13.59.36.215/commentArea-plugin/', // 這個網址不能更換
        containerClassName:'comment-area' // 輸入要放入插件的容器的 class 名稱
      })
    })
  </script>
```

### 成果展示

<img src="https://github.com/Wangpoching/commentArea-plugin/blob/master/images/screenshots/.png" width="300" align=center/>

這麼美的留言板插件你能不用在你的網頁裡嗎~?

## Contacts

Poching Wang

[wangpeter588@gmail.com](https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=wangpeter588@gmail.com)

[LinkedIn](www.linkedin.com/in/wangpoching)

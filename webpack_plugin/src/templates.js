export function getLoadMore(className) {
  return `<div class="row justify-content-center my-3"><button class="btn btn-primary col-4 ${className}" type="button">載入更多</button></div>`
}

export function getAddCommentForm(className, commentsClassName, wrapperClassName) {
  return `
    <div class="${wrapperClassName} d-flex flex-column">
      <div class="container-fluid bg-light py-5 main">
        <h2>討論區</h2>
        <form class="${className}">
          <div class="form-group">
            <div class="input-group flex-column">
                <label for="nickname-input" class="mt-3">暱稱</label>       
                <input name = "nickname" type="text" class="form-control w-25" placeholder="您的暱稱" id="nickname-input" aria-label="user nickname" aria-describedby="button-addon2">
            </div>
            <label for="content-textarea" class="mt-3">留言內容</label>
            <textarea name="content" class="form-control" id="content-textarea" rows="5"></textarea>
          </div>
          <button type="submit" class="btn btn-primary mt-3 btn-submit">提交</button>
          <a type="submit" class="btn btn-primary mt-3 btn-refresh" href="#">刷新頁面</a>
        </form>
        <div class="${commentsClassName} row justify-content-center mt-5">
        </div>
      </div>
      <div class="container-fluid mt-auto d-flex flex-row-reverse bg-dark footer">
        <div class="dropup">
          <a class="btn btn-dark dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"></a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li><a class="dropdown-item btn-gobottom">移至最底</a></li>
            <li><a class="dropdown-item btn-gotop">回到頂部</a></li>
          </ul>
        </div>
      </div>
    </div>
  `
}

$(function () {
  'use strict'
  $('[data-toggle="chat-offcanvas"], .channel').on('click', function () {
    $('.chat-offcanvas').toggleClass('open')
  })
})

$(function () {
  'use strict'
  $('[data-toggle="sidebar-offcanvas"], .btn.menu-link').on('click', function () {
    $('.sidebar-offcanvas').toggleClass('open')
  })
})

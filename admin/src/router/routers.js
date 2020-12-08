import Main from '@/components/main'
// import parentView from '@/components/parent-view'
// import { dynamicRouterAdd } from '@/libs/router-util'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/min-app',
    name: 'min-app',
    meta: {
      hideInMenu: false,
      icon: 'md-clipboard',
      title: '微信小程序'
    },
    component: Main,
    children: [
      {
        path: 'cog',
        name: 'cog',
        meta: {
          icon: 'md-cog',
          title: '设置'
        },
        component: () => import('@/view/min-app/cog.vue')
      },
      {
        path: 'type',
        name: 'type',
        meta: {
          icon: 'md-keypad',
          title: '分类'
        },
        component: () => import('@/view/min-app/type.vue')
      },
      {
        path: 'word',
        name: 'word',
        meta: {
          icon: 'logo-wordpress',
          title: '单词'
        },
        component: () => import('@/view/min-app/word.vue')
      },
      {
        path: 'wordForm',
        name: 'wordForm',
        meta: {
          icon: 'logo-outlet',
          hideInMenu: true,
          title: route => `${route.query.id?'修改单词':'新增单词'}`
        },
        component: () => import('@/view/min-app/wordForm.vue')
      },
    ]
  },
  {
    path: '',
    name: 'iviewui',
    meta: {
      title: '文档',
      href: 'http://v1.iviewui.com/docs/introduce',
      icon: 'md-book'
    }
  },
  {
    path: '',
    name: 'weixin',
    meta: {
      title: '微信公共平台',
      href: 'https://mp.weixin.qq.com/',
      icon: 'md-bookmarks'
    }
  },
  {
    path: '',
    name: 'tencent',
    meta: {
      title: '腾讯云',
      href: 'https://cloud.tencent.com/',
      icon: 'md-bookmark'
    }
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

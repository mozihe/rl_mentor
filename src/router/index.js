import { createRouter, createWebHistory } from 'vue-router'



const routes = [
  { path: '/',            component: () => import('../pages/Login.vue') },
  { path: '/dashboard',            component: () => import('../pages/Dashboard.vue') },
  { path: '/courses',     component: () => import('../pages/Courses.vue') },
  { path: '/sandbox',     component: () => import('../pages/Sandbox.vue') },
  { path: '/community',   component: () => import('../pages/Community.vue') },
  { path: '/community/:id', component: () => import('../pages/Community.vue') },
  { path: '/leaderboard', component: () => import('../pages/Leaderboard.vue') },
  { path: '/profile',     component: () => import('../pages/Profile.vue') },
  { path: '/course/:id',  component: () => import('../pages/CourseContent.vue'), props: true },
  { path:'/mentor', component: () => import('../pages/AiMentor.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
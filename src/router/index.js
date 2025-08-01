import { createRouter, createWebHistory } from 'vue-router'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name : 'home',
      beforeEnter : (to,from,next) =>{
        const EXISTINGVARIANT = getCookie('variant');
        if (!EXISTINGVARIANT){
            const variant = Math.random() < 0.5 ? 'A' : 'B'
            setCookie('variant', variant,7)
            next({name:variant == 'A' ? 'InterfaceA' : 'InterfaceB'})
            
        }
        else {
          next({ name: EXISTINGVARIANT === 'A' ? 'InterfaceA' : 'InterfaceB' });
        }
  
      },
      component : () => import("../views/HomeView.vue")
      
    },
    {
      path: '/interface-a',
      name: 'InterfaceA',
      component: ()=> import('../views/HomeView.vue'),
    },
    {
      path: '/interface-b',
      name: 'InterfaceB',
      component: ()=>import('../views/HomeViewB.vue'),
    },

    {
      path: '/search/',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SearchView.vue')
    },

    {
      path: '/search-b/',
      name: 'search-b',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SearchViewB.vue')
    },
    
    {

    }
  ]
})


export default router

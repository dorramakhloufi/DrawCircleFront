import { createRouter, createWebHistory } from 'vue-router';
import CircleComponent from '@/components/CircleComponent';

const routes = [
  { path: '/:setId?',name:'CircleComponent', component: CircleComponent } ,
  { 
    path: '/', 
    redirect: () => {
      const setId = Math.floor(Math.random() * 1000) + 1;
      return `/${setId}`;
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

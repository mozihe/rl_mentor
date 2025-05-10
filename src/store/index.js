import { defineStore } from 'pinia'
import { courses, experiments, posts } from '../mock/data'

export const useMainStore = defineStore('main', {
    state: () => ({
      courses,
      experiments,
      posts,
      user: { name: 'zjh', points: 1234 },
    }),
  
    /* 新增：切换实验状态 & 超参写回 */
    actions: {
      toggleExperiment(id, data = {}) {
        const exp = this.experiments.find(e => e.id === id)
        if (!exp) return
  
        // 切状态
        if (data.status) exp.status = data.status
        // 更新超参
        if (data.params) exp.params = { ...exp.params, ...data.params }
      },
    },
  })
  

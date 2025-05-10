// src/mock/data.js
import { faker } from '@faker-js/faker'

/* ---------- 课程 ---------- */

// ───────── Pinia 全局课程数据 ─────────
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    courses
  })
})

// 单独拆出来方便你以后手改 / 从后端拉
/* src/store/index.js */


export const courses = [
  /* ===== 我的课程 0‒6 ===== */
  {
    id: 0,
    title: 'Python 基础',
    level: '入门',
    progress: 1,
    enrolled: true,
    brief: '面向零基础，涵盖变量、流程控制、函数、面向对象与标准库。',
    video: 'https://www.bilibili.com/video/BV1qW4y1a7fU',
    objectives: [
      '掌握变量 / 数据类型 / 运算符',
      '会写 if-else、for、while',
      '能封装函数并理解作用域'
    ],
    toc: [
      { id: '0-0', title: '引言',           done: true,  desc: '课程结构与学习方法概览。'},
      { id: '0-1', title: '变量与 I/O',     done: true,  desc: '认识变量类型，掌握 input / print。' },
      { id: '0-2', title: '控制流',         done: true,  desc: '条件分支、循环与 break / continue。' },
      { id: '0-3', title: '函数',           done: true,  desc: '定义函数、参数传递与作用域。' },
      { id: '0-4', title: '面向对象',       done: true,  desc: '类、实例、继承与魔术方法。' },
      { id: '0-5', title: '标准库速览',     done: false, desc: 'os、sys、datetime 等常用模块。' }
    ],

  },

  {
    id: 1,
    title: '算法与数据结构',
    level: '入门',
    progress: 0.8,
    enrolled: true,
    brief: '链表、栈队列、排序与查找算法，培养算法思维与复杂度分析。',
    video: 'https://cdn.example.com/rlmentor/dsa.mp4',
    objectives: [
      '掌握时间 / 空间复杂度符号',
      '能手写链表、栈、队列',
      '实现常见排序并比较性能'
    ],
    toc: [
      { id: '1-0', title: '复杂度分析', done: true,  desc: '大 O 记号与对数级别比较。' },
      { id: '1-1', title: '线性表结构', done: true,  desc: '顺序表、链表及典型操作。' },
      { id: '1-2', title: '树 & 图',    done: false, desc: '二叉树、B 树与图遍历初识。' },
      { id: '1-3', title: '排序算法',   done: false, desc: '冒泡、归并、快速排序。' },
      { id: '1-4', title: '查找算法',   done: false, desc: '二分查找与哈希表设计。' }
    ],
    quizzes: [
      {
        id: 'q1-1',
        order: 1,
        title: '算法 · 测验',
        questions: [
          { id: 1, q: '快速排序平均时间复杂度？', type: 'choice', opts: ['O(n log n)', 'O(n²)'] }
        ]
      }
    ],
    assignments: [
      {
        id: 'a1-1',
        order: 1,
        title: '链表反转',
        deadline: '2025-06-20',
        spec: '实现单链表、双链表，并编写反转函数，提交代码和复杂度分析。'
      }
    ]
  },

  {
    id: 2,
    title: '概率论',
    level: '进阶',
    progress: 0.6,
    enrolled: true,
    brief: '随机事件、常见分布与大数定律，为机器学习打基础。',
    video: 'https://cdn.example.com/rlmentor/probability.mp4',
    objectives: [
      '理解随机变量与分布函数',
      '会算期望 / 方差 / 协方差',
      '掌握二项分布、正态分布'
    ],
    toc: [
      { id: '2-0', title: '样本空间与事件', done: true,  desc: '事件代数与集合运算。' },
      { id: '2-1', title: '条件概率',       done: true,  desc: '全概率与贝叶斯公式。' },
      { id: '2-2', title: '随机变量',       done: false, desc: '离散 / 连续随机变量。' },
      { id: '2-3', title: '数字特征',       done: false, desc: '期望、方差与协方差。' },
      { id: '2-4', title: '极限定理',       done: false, desc: '大数定律与中心极限定理。' }
    ],
    quizzes: [
      {
        id: 'q2-1',
        order: 1,
        title: '概率论 · 测验',
        questions: [
          { id: 1, q: '二项分布 B(n,p) 的期望等于？', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a2-1',
        order: 1,
        title: '骰子实验',
        deadline: '2025-06-28',
        spec: '用 Python 模拟掷骰子 10,000 次，验证大数定律并绘图。'
      }
    ]
  },

  {
    id: 3,
    title: '线性代数',
    level: '进阶',
    progress: 0.6,
    enrolled: true,
    brief: '矩阵运算、特征分解与 SVD，是理解深度学习的关键。',
    video: 'https://cdn.example.com/rlmentor/linear-algebra.mp4',
    objectives: [
      '会算矩阵乘法与逆',
      '理解秩、线性相关、基',
      '掌握特征分解与 SVD'
    ],
    toc: [
      { id: '3-0', title: '向量空间',    done: true,  desc: '基、维数与子空间。' },
      { id: '3-1', title: '矩阵运算',    done: true,  desc: '乘法、逆与分块矩阵。' },
      { id: '3-2', title: 'LU 分解',     done: false, desc: '高斯消元与 LU 三角分解。' },
      { id: '3-3', title: '特征分解',    done: false, desc: '特征值、向量与对角化。' },
      { id: '3-4', title: '奇异值分解',  done: false, desc: 'SVD 与降维应用。' }
    ],
    quizzes: [
      {
        id: 'q3-1',
        order: 1,
        title: '线性代数 · 测验',
        questions: [
          { id: 1, q: '矩阵可逆当且仅当其行列式 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a3-1',
        order: 1,
        title: 'SVD 图像压缩',
        deadline: '2025-07-05',
        spec: '用 SVD 压缩灰度图像，对比不同奇异值保留比例的 PSNR。'
      }
    ]
  },

  {
    id: 4,
    title: '强化学习基础',
    level: '进阶',
    progress: 0.4,
    enrolled: true,
    brief: '从 MDP 出发，讲解 Q-Learning、SARSA 等经典算法。',
    video: 'https://cdn.example.com/rlmentor/rl-basics.mp4',
    objectives: [
      '理解 MDP 五元组',
      '推导 Bellman 方程',
      '实现 Q-learning / SARSA'
    ],
    toc: [
      { id: '4-0', title: 'RL 入门',     done: true,  desc: 'RL 框架与监督学习差异。' },
      { id: '4-1', title: 'MDP & 回报', done: true,  desc: '状态转移、折扣回报。' },
      { id: '4-2', title: '值函数',     done: false, desc: '状态值 / 动作值函数。' },
      { id: '4-3', title: 'Q-learning', done: false, desc: '离线更新与 ε-greedy。' },
      { id: '4-4', title: 'SARSA',      done: false, desc: '在线更新 on-policy。' }
    ],
    quizzes: [
      {
        id: 'q4-1',
        order: 1,
        title: 'RL 基础 · 测验',
        questions: [
          { id: 1, q: 'Bellman 方程描述 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a4-1',
        order: 1,
        title: 'FrozenLake Q-learning',
        deadline: '2025-07-15',
        spec: '使用 OpenAI Gym FrozenLake，训练智能体并绘制学习曲线。'
      }
    ]
  },

  {
    id: 5,
    title: 'PyTorch 实战',
    level: '进阶',
    progress: 0.3,
    enrolled: true,
    brief: '张量操作、自动求导、模型构建与调参技巧。',
    video: 'https://cdn.example.com/rlmentor/pytorch.mp4',
    objectives: [
      '熟练使用 Tensor API',
      '掌握 autograd 机制',
      '会写自定义 Dataset & 模型'
    ],
    toc: [
      { id: '5-0', title: 'Tensor 基础',   done: true,  desc: '创建张量与广播机制。' },
      { id: '5-1', title: 'autograd',     done: false, desc: '自动求导原理。' },
      { id: '5-2', title: 'Module & nn',  done: false, desc: '模型模块化与参数管理。' },
      { id: '5-3', title: '训练循环',     done: false, desc: '前向、反向与优化器。' }
    ],
    quizzes: [
      {
        id: 'q5-1',
        order: 1,
        title: 'PyTorch · 测验',
        questions: [
          { id: 1, q: '哪条语句会关闭梯度记录？', type: 'choice',
            opts: ['torch.no_grad()', 'tensor.detach()', '两者都行'] }
        ]
      }
    ],
    assignments: [
      {
        id: 'a5-1',
        order: 1,
        title: 'MNIST 手写识别',
        deadline: '2025-07-25',
        spec: '用 CNN 实现 MNIST 分类，准确率 ≥ 98%。'
      }
    ]
  },

  {
    id: 6,
    title: '深度强化学习',
    level: '硬核',
    progress: 0.1,
    enrolled: true,
    brief: 'DQN / A3C / PPO 等 DRL 算法原理与实践。',
    video: 'https://cdn.example.com/rlmentor/drl.mp4',
    objectives: [
      '实现 DQN 并训练 CartPole',
      '掌握策略梯度 & PPO',
      '了解分布式 A3C 架构'
    ],
    toc: [
      { id: '6-0', title: 'DQN', done: false, desc: '经验回放与目标网络。' },
      { id: '6-1', title: 'A3C', done: false, desc: '多线程 Actor-Critic。' },
      { id: '6-2', title: 'PPO', done: false, desc: '剪切目标函数与策略更新。' }
    ],
    quizzes: [
      {
        id: 'q6-1',
        order: 1,
        title: 'DRL · 测验',
        questions: [
          { id: 1, q: 'PPO 损失函数中的 clip 作用是什么？', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a6-1',
        order: 1,
        title: 'Atari Pong with DQN',
        deadline: '2025-08-10',
        spec: '复现 DQN 并在 Atari Pong 达到 18+ 平均回报。'
      }
    ]
  },

  /* ===== 额外 8 门待选课程 7‒14 ===== */
  {
    id: 7,
    title: '机器学习导论',
    level: '进阶',
    enrolled: false,
    progress: 0,
    brief: '监督 / 无监督 / 聚类等 ML 基础理论与实践。',
    video: 'https://cdn.example.com/rlmentor/ml-intro.mp4',
    objectives: [
      '理解监督学习流程',
      '掌握 K-Means 聚类',
      '实现简单回归模型'
    ],
    toc: [
      { id: '7-0', title: 'ML 概览',      done: false, desc: '机器学习任务与术语。' },
      { id: '7-1', title: '监督学习',    done: false, desc: '回归与分类基础。' },
      { id: '7-2', title: '无监督学习',  done: false, desc: '聚类与降维方法。' }
    ],
    quizzes: [
      {
        id: 'q7-1',
        order: 1,
        title: 'ML 导论 · 测验',
        questions: [
          { id: 1, q: 'KNN 中 K 值过大会导致 ___', type: 'choice', opts:['过拟合','欠拟合'] }
        ]
      }
    ],
    assignments: [
      {
        id: 'a7-1',
        order: 1,
        title: 'K-Means 实现',
        deadline: '2025-08-20',
        spec: '纯 numpy 实现 K-Means，对 Iris 数据集聚类并评估。'
      }
    ]
  },

  {
    id: 8,
    title: '深度学习',
    level: '进阶',
    enrolled: false,
    progress: 0,
    brief: '多层感知机、卷积网络、循环网络到 Transformer。',
    video: 'https://cdn.example.com/rlmentor/deep-learning.mp4',
    objectives: [
      '掌握 MLP & CNN 基础',
      '理解 RNN / LSTM',
      '熟悉 Transformer 架构'
    ],
    toc: [
      { id: '8-0', title: '感知机 & MLP',   done: false, desc: '多层全连接网络。' },
      { id: '8-1', title: '卷积网络',       done: false, desc: '特征提取与参数共享。' },
      { id: '8-2', title: '循环网络',       done: false, desc: '时间序列建模。' },
      { id: '8-3', title: '注意力机制',     done: false, desc: 'Seq-2-Seq 与 Transformer。' }
    ],
    quizzes: [
      {
        id: 'q8-1',
        order: 1,
        title: 'DL · 测验',
        questions: [
          { id: 1, q: 'ReLU 函数在输入 < 0 时梯度为 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a8-1',
        order: 1,
        title: 'CNN CIFAR-10',
        deadline: '2025-08-30',
        spec: '构建 ResNet-18，在 CIFAR-10 达到 90%+ 准确率。'
      }
    ]
  },

  {
    id: 9,
    title: '自然语言处理',
    level: '硬核',
    enrolled: false,
    progress: 0,
    brief: 'BERT、GPT 等预训练模型与文本生成、序列标注实战。',
    video: 'https://cdn.example.com/rlmentor/nlp.mp4',
    objectives: [
      '掌握词向量与 BPE',
      '理解 BERT 预训练',
      '实现文本分类 & 生成'
    ],
    toc: [
      { id: '9-0', title: '词嵌入',            done: false, desc: 'Word2Vec 与 FastText。' },
      { id: '9-1', title: '预训练语言模型',    done: false, desc: 'BERT、GPT 原理。' },
      { id: '9-2', title: '下游任务',          done: false, desc: '序列标注、文本生成。' }
    ],
    quizzes: [
      {
        id: 'q9-1',
        order: 1,
        title: 'NLP · 测验',
        questions: [
          { id: 1, q: 'BPE 的全称是 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a9-1',
        order: 1,
        title: 'BERT 文本分类',
        deadline: '2025-09-05',
        spec: '微调中文 BERT 做情感分析，F1 ≥ 0.92。'
      }
    ]
  },

  {
    id: 10,
    title: '计算机视觉',
    level: '硬核',
    enrolled: false,
    progress: 0,
    brief: '目标检测、实例分割与视觉 Transformer。',
    video: 'https://cdn.example.com/rlmentor/cv.mp4',
    objectives: [
      '熟悉卷积特征提取',
      '实现目标检测 YOLO',
      '了解 ViT 架构'
    ],
    toc: [
      { id: '10-0', title: 'CNN 进阶',        done: false, desc: '残差网络与空洞卷积。' },
      { id: '10-1', title: '目标检测',        done: false, desc: 'YOLO / Faster-RCNN。' },
      { id: '10-2', title: '实例分割',        done: false, desc: 'Mask-RCNN 与 panoptic。' },
      { id: '10-3', title: '视觉 Transformer',done: false, desc: 'ViT 与 DeiT。' }
    ],
    quizzes: [
      {
        id: 'q10-1',
        order: 1,
        title: 'CV · 测验',
        questions: [
          { id: 1, q: 'ViT 将图像分割成 ___ 个 patch？(224², 16×16)', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a10-1',
        order: 1,
        title: 'YOLOv5 目标检测',
        deadline: '2025-09-15',
        spec: '用 YOLOv5 训练 COCO-subset 模型并提交 mAP50。'
      }
    ]
  },

  {
    id: 11,
    title: '分布式系统',
    level: '硬核',
    enrolled: false,
    progress: 0,
    brief: '一致性、CAP、Raft、微服务与云原生。',
    video: 'https://cdn.example.com/rlmentor/distributed.mp4',
    objectives: [
      '理解 CAP 定理',
      '掌握 Raft 协议',
      '了解微服务架构'
    ],
    toc: [
      { id: '11-0', title: 'CAP & BASE',  done: false, desc: '一致性与可用性权衡。' },
      { id: '11-1', title: '一致性协议',  done: false, desc: 'Paxos / Raft。' },
      { id: '11-2', title: '微服务',      done: false, desc: '服务拆分与治理。' },
      { id: '11-3', title: '云原生',      done: false, desc: 'Kubernetes & Service Mesh。' }
    ],
    quizzes: [
      {
        id: 'q11-1',
        order: 1,
        title: '分布式 · 测验',
        questions: [
          { id: 1, q: 'Raft 通过 ___ 来选举新 Leader', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a11-1',
        order: 1,
        title: '实现简易 KV Raft',
        deadline: '2025-09-25',
        spec: '用 Go 实现一个带 Raft 的分布式键值存储，支持故障恢复。'
      }
    ]
  },

  {
    id: 12,
    title: '操作系统原理',
    level: '进阶',
    enrolled: false,
    progress: 0,
    brief: '进程 / 线程、内存管理、文件系统与 I/O 调度。',
    video: 'https://cdn.example.com/rlmentor/os.mp4',
    objectives: [
      '掌握进程调度',
      '理解虚拟内存',
      '熟悉文件系统实现'
    ],
    toc: [
      { id: '12-0', title: '进程 & 线程', done: false, desc: 'PCB、上下文切换。' },
      { id: '12-1', title: '内存管理',   done: false, desc: '分页、分段与虚拟内存。' },
      { id: '12-2', title: '文件系统',   done: false, desc: '索引节点与目录结构。' },
      { id: '12-3', title: 'I/O 调度',   done: false, desc: '同步 / 异步 I/O。' }
    ],
    quizzes: [
      {
        id: 'q12-1',
        order: 1,
        title: 'OS · 测验',
        questions: [
          { id: 1, q: '虚拟内存地址到物理地址通过什么结构？', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a12-1',
        order: 1,
        title: 'LRU 页面置换',
        deadline: '2025-10-05',
        spec: '模拟实现 LRU 页表置换算法并分析缺页率。'
      }
    ]
  },

  {
    id: 13,
    title: '数据库系统',
    level: '进阶',
    enrolled: false,
    progress: 0,
    brief: '关系 / NoSQL、索引、事务与查询优化。',
    video: 'https://cdn.example.com/rlmentor/db.mp4',
    objectives: [
      '掌握三范式设计',
      '理解事务 ACID',
      '会用索引加速查询'
    ],
    toc: [
      { id: '13-0', title: '关系模型',  done: false, desc: '表、键与范式。' },
      { id: '13-1', title: '索引结构',  done: false, desc: 'B+Tree 与哈希索引。' },
      { id: '13-2', title: '事务管理',  done: false, desc: 'ACID 与隔离级别。' },
      { id: '13-3', title: '查询优化',  done: false, desc: '执行计划与代价估计。' }
    ],
    quizzes: [
      {
        id: 'q13-1',
        order: 1,
        title: 'DB · 测验',
        questions: [
          { id: 1, q: '事务四特性 ACID 中 I 代表 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a13-1',
        order: 1,
        title: '索引性能实验',
        deadline: '2025-10-15',
        spec: '对比 B+Tree 与 Hash 索引在百万级数据集上的查询延迟。'
      }
    ]
  },

  {
    id: 14,
    title: '数据结构习题集',
    level: '入门',
    enrolled: false,
    progress: 0,
    brief: '300 道经典数据结构练习题，附解析与代码模板。',
    video: 'https://cdn.example.com/rlmentor/ds-practice.mp4',
    objectives: [
      '熟练掌握线性表',
      '强化树结构思维',
      '刷题提升编码速度'
    ],
    toc: [
      { id: '14-0', title: '线性表练习', done: false, desc: '数组、链表、栈队列题目。' },
      { id: '14-1', title: '树结构练习', done: false, desc: '二叉树、堆与并查集。' },
      { id: '14-2', title: '图结构练习', done: false, desc: 'DFS/BFS、最短路径等。' }
    ],
    quizzes: [
      {
        id: 'q14-1',
        order: 1,
        title: 'DS 练习 · 测验',
        questions: [
          { id: 1, q: '二叉搜索树的中序遍历结果是 ___', type: 'blank' }
        ]
      }
    ],
    assignments: [
      {
        id: 'a14-1',
        order: 1,
        title: '堆排序实现',
        deadline: '2025-10-25',
        spec: '实现堆排序并对 1e5 随机数组测试时间复杂度。'
      }
    ]
  }
]




/* ---------- 实验 ---------- */
const GPU_POOL = ['A100', '3090', 'V100', 'RTX 4090']
export const experiments = Array.from({ length: 30 }, () => {
  const statusRand = faker.number.int({ min: 0, max: 2 })
  const status = ['running', 'paused', 'finished'][statusRand]
  return {
    id: faker.string.uuid(),
    name: faker.hacker.verb() + ' ' + faker.word.noun(),
    status,
    step: faker.number.int({ min: 1e4, max: 3e5 }),
    reward: Number(faker.number.float({ min: 50, max: 250 }).toFixed(1)),
    gpu: faker.helpers.arrayElement(GPU_POOL),
    visibility: faker.helpers.arrayElement(['public', 'lab', 'private']),
    logs: [],
    errors: status === 'running' && Math.random() < 0.1
      ? ['CUDA out of memory'] : []
  }
})

/* ---------- 帖子 ---------- */
const TAGS = ['教学贴', '求助贴', '讨论贴', '经验贴']
export const posts = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  author: faker.internet.userName(),
  title: faker.hacker.phrase(),
  content: faker.lorem.paragraphs(2),
  likes: faker.number.int({ min: 0, max: 500 }),
  comments: [],
  tag: faker.helpers.arrayElement(TAGS),
}))
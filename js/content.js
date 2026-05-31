const SITE_NAME = "Robot D";
const SITE_TAGLINE_EN = "Your Daily Pulse on Robotics & AI";
const SITE_TAGLINE_ZH = "机器人每日快讯";

const CATEGORIES = [
  { slug: "all",            en: "All Articles",           zh: "全部文章", icon: "" },
  { slug: "humanoid",       en: "Humanoid Robots",        zh: "人形机器人", icon: "images/icon-humanoid.svg" },
  { slug: "industrial",     en: "Industrial Automation",  zh: "工业自动化", icon: "images/icon-industrial.svg" },
  { slug: "ai-robotics",    en: "AI & Robotics",          zh: "AI与机器人", icon: "images/icon-ai-robotics.svg" },
  { slug: "drones",         en: "Drones & UAVs",          zh: "无人机", icon: "images/icon-drones.svg" },
  { slug: "medical",        en: "Medical Robotics",       zh: "医疗机器人", icon: "images/icon-medical.svg" },
  { slug: "research",       en: "Research & Breakthroughs", zh: "研究突破", icon: "images/icon-research.svg" }
];

const ARTICLE_MANIFEST = [
  {
    slug: "1x-neo-mass-production-2026",
    date: "2026-05-31",
    category: "humanoid",
    featured: true,
    en: {
      title: "1X's NEO Goes Mass-Production: The First US Humanoid Robot Factory Is Here, and It Changes Everything",
      summary: "1X Technologies opens the first vertically integrated humanoid robot factory in California, shipping 10,000 NEO units with a self-learning World Model at $20,000 each."
    },
    zh: {
      title: "1X NEO 人形机器人量产启幕：美国首座人形机器人工厂投产，自主学习的时代开始了",
      summary: "1X Technologies 在加州启动全球首座全垂直整合的人形机器人工厂，年产万台 NEO，搭载世界模型实现自主学习，售价 2 万美元起。"
    }
  },
  {
    slug: "duke-argus-omnidirectional-robot-2026",
    date: "2026-05-31",
    category: "research",
    featured: false,
    en: {
      title: "Duke University's 20-Legged Argus Robot Shatters a Hidden Assumption in Robotics Design",
      summary: "Duke researchers unveil Argus, a sea-urchin-like robot with 20 legs and 20 cameras that moves equally well in all directions — scoring 0.91 on a new metric called dynamic isotropy, nearly double the score of humanoids and quadrupeds."
    },
    zh: {
      title: "杜克大学20足机器人Argus打破机器人设计的隐性桎梏",
      summary: "杜克大学研究人员发布海胆状20足20眼机器人Argus，在所有方向上均等移动——在名为'动态各向同性'的新指标上得分0.91，接近人形机器人和四足机器人的两倍。"
    }
  },
  {
    slug: "ntu-seed-sized-surgical-robot-2026",
    date: "2026-05-30",
    category: "medical",
    featured: false,
    en: {
      title: "A Seed-Sized Surgeon: NTU Singapore's 4.4mm Robot Packs Five Surgical Tools Into a Single Grain-Scale Body",
      summary: "NTU Singapore unveils a 4.4mm seed-sized robot with five surgical functions — moving, cutting, drug release, gripping, and heating — switched in under a second."
    },
    zh: {
      title: "种子大小的手术机器人：NTU新加坡4.4毫米微型机器人集五种手术功能于一身",
      summary: "南洋理工大学发布4.4毫米种子大小手术机器人，集成移动、切割、给药、抓取、热疗五种功能，一秒内完成切换。"
    }
  },
  {
    slug: "aquila-earth-laser-power-2026",
    date: "2026-05-30",
    category: "industrial",
    featured: true,
    en: {
      title: "Aquila Earth Sets Two World Records: Laser-Beamed Power Keeps a Robot Running for 24 Hours Straight",
      summary: "Sydney startup Aquila Earth powered a warehouse robot for 24 continuous hours using only an infrared laser beam — no battery swaps, no charging downtime, two world records — signaling that wireless power has crossed from laboratory curiosity to industrial reality."
    },
    zh: {
      title: "Aquila Earth 创两项世界纪录：激光束供电驱动机器人连续运行 24 小时，无线输电跨过产业门槛",
      summary: "悉尼创业公司 Aquila Earth 用红外激光束驱动一台仓库机器人连续运行 24 小时、行驶 25 公里，创下两项世界纪录。千瓦级激光器成本四年内从 12 万美元降至 6000 美元，无线输电技术正从实验室走向工厂车间。"
    }
  },
  {
    slug: "wing-tokyo-drone-network-2026",
    date: "2026-05-25",
    category: "drones",
    featured: true,
    en: {
      title: "Wing Launches World's First City-Wide Autonomous Drone Delivery Network in Tokyo",
      summary: "Alphabet's Wing Aviation goes live with 85 drone nests across Tokyo, completing 18,000 deliveries in three days and proving autonomous urban drone delivery works at megacity scale."
    },
    zh: {
      title: "Wing 在东京启动全球首个全城自主无人机配送网络",
      summary: "Alphabet 旗下 Wing Aviation 在东京部署 85 个无人机巢，三天内完成 18000 次配送，证明自主城市无人机配送在超大城市规模下可行。"
    }
  },
  {
    slug: "unitree-gd01-mecha",
    date: "2026-05-12",
    category: "humanoid",
    featured: true,
    image: "image/宇树科技发布 GD01：全球首款量产载人变形机甲震撼亮相.jpeg",
    en: {
      title: "Unitree Unveils GD01: The World's First Mass-Produced Piloted Transforming Mecha",
      summary: "Unitree Robotics shocks the world with GD01, a pilotable 3-meter-tall mecha that switches between bipedal and quadrupedal modes, priced at 3.9 million yuan — and the CEO personally piloted it on stage."
    },
    zh: {
      title: "宇树科技发布 GD01：全球首款量产载人变形机甲震撼亮相",
      summary: "宇树科技发布 GD01 载人变形机甲，高近 3 米、重 500 公斤，可在双足与四足模式间切换，售价 390 万元起。CEO 王兴兴亲自登车驾驶，全程实拍无 AI。"
    }
  },
  {
    slug: "figure-02-bmw-production",
    date: "2026-05-18",
    category: "humanoid",
    featured: true,
    en: {
      title: "Figure 02 Humanoid Robot Enters Full Production at BMW Spartanburg Plant",
      summary: "Figure AI's 02 humanoid robot has moved from pilot testing to full production deployment at BMW's South Carolina factory, marking the first commercial-scale humanoid workforce in automotive manufacturing."
    },
    zh: {
      title: "Figure 02 人形机器人在宝马斯帕坦堡工厂全面投产",
      summary: "Figure AI 的 02 人形机器人已从试点测试阶段进入宝马南卡罗来纳州工厂的全面生产部署，这是汽车制造业首次实现商业规模的人形机器人劳动力。"
    }
  },
  {
    slug: "tesla-optimus-gen3-update",
    date: "2026-05-10",
    category: "humanoid",
    featured: false,
    en: {
      title: "Tesla Optimus Gen 3: New Dexterity Milestones and a Roadmap to Mass Production",
      summary: "Tesla reveals Optimus Gen 3 with 22-DoF hands, improved battery life, and a concrete timeline for consumer availability starting at $20,000."
    },
    zh: {
      title: "特斯拉 Optimus 第三代：灵巧手突破性进展与量产路线图",
      summary: "特斯拉发布 Optimus 第三代，配备 22 自由度灵巧手、更长续航，并明确宣布消费者版目标售价 2 万美元。"
    }
  },
  {
    slug: "abb-collaborative-robots-2026",
    date: "2026-04-22",
    category: "industrial",
    featured: false,
    en: {
      title: "ABB Launches GoFa Pro: Next-Gen Collaborative Robots with AI-Powered Safety",
      summary: "ABB's new GoFa Pro cobot series features embedded AI safety systems that dynamically adjust speed and force based on real-time human proximity, eliminating the need for safety fences."
    },
    zh: {
      title: "ABB 发布 GoFa Pro：搭载 AI 动力安全系统的下一代协作机器人",
      summary: "ABB 新型 GoFa Pro 协作机器人系列配备嵌入式 AI 安全系统，可根据实时人体接近距离动态调整速度和力矩，无需安全围栏。"
    }
  },
  {
    slug: "amazon-sparrow-warehouse",
    date: "2026-04-15",
    category: "industrial",
    featured: false,
    en: {
      title: "Amazon Sparrow Reaches 1 Billion Picks: Inside the AI That Powers the World's Largest Mobile Robot Fleet",
      summary: "Amazon's AI-powered Sparrow picking system has processed one billion items, revealing how computer vision and reinforcement learning are transforming warehouse logistics at unprecedented scale."
    },
    zh: {
      title: "Amazon Sparrow 突破十亿挑拣：驱动全球最大移动机器人机群的 AI 揭秘",
      summary: "Amazon 的 AI 驱动 Sparrow 分拣系统已处理十亿件商品，展示了计算机视觉和强化学习如何以前所未有的规模变革仓储物流。"
    }
  },
  {
    slug: "deepmind-rt-3",
    date: "2026-05-05",
    category: "ai-robotics",
    featured: true,
    image: "image/Google DeepMind 发布 RT-3 机器人基础模型：一个大脑控制几十种机器人，无需重新训练.jpeg",
    en: {
      title: "Google DeepMind's RT-3 Robot Foundation Model: One Brain, Dozens of Robots, Zero Retraining",
      summary: "DeepMind unveils Robotics Transformer 3 (RT-3), a vision-language-action foundation model that controls robots from 8 different manufacturers without per-robot fine-tuning."
    },
    zh: {
      title: "Google DeepMind 发布 RT-3 机器人基础模型：一个大脑控制几十种机器人，无需重新训练",
      summary: "DeepMind 发布 Robotics Transformer 3 (RT-3)，这是一个视觉-语言-动作基础模型，无需按机器人微调即可控制来自 8 家不同制造商的机器人。"
    }
  },
  {
    slug: "nvidia-groot-2026",
    date: "2026-04-08",
    category: "ai-robotics",
    featured: false,
    en: {
      title: "NVIDIA GR00T Goes Public: The Generalist Robot AI Platform Now Open to Developers Worldwide",
      summary: "NVIDIA opens its GR00T robot foundation model platform to all developers, providing a cloud-based training and deployment pipeline that could democratize generalist robot AI."
    },
    zh: {
      title: "NVIDIA GR00T 平台向全球开发者开放：通用型机器人 AI 的民主化时刻",
      summary: "NVIDIA 向所有开发者开放 GR00T 机器人基础模型平台，提供基于云端的训练和部署流程，有望普及通用型机器人 AI 开发。"
    }
  },
  {
    slug: "zipline-drone-delivery-2026",
    date: "2026-03-28",
    category: "drones",
    featured: false,
    en: {
      title: "Zipline Expands Drone Delivery to 50 US Cities, Launches Next-Gen Platform 3",
      summary: "Zipline announces massive US expansion with its Platform 3 delivery drone system, promising 10-minute deliveries within a 30-mile radius across 50 metropolitan areas by year-end."
    },
    zh: {
      title: "Zipline 将无人机配送拓展至 50 个美国城市，发布新一代 Platform 3 系统",
      summary: "Zipline 宣布凭借其 Platform 3 配送无人机系统进行大规模美国扩张，承诺在年底前于 50 个大都市区实现 30 英里半径内 10 分钟送达。"
    }
  },
  {
    slug: "dji-dock-3",
    date: "2026-03-14",
    category: "drones",
    featured: false,
    en: {
      title: "DJI Dock 3: The Autonomous Drone-in-a-Box That Runs 24/7 Without Human Intervention",
      summary: "DJI's third-generation drone dock enables fully autonomous drone operations for industrial inspection, security, and agriculture."
    },
    zh: {
      title: "DJI Dock 3：全天候无人值守的自主无人机机库发布",
      summary: "大疆创新发布第三代无人机机库，实现工业巡检、安防和农业领域的全自主无人机运营——充电、数据上传、任务规划全部无需人员到场。"
    }
  },
  {
    slug: "da-vinci-xi-successor",
    date: "2026-05-12",
    category: "medical",
    featured: false,
    en: {
      title: "Intuitive Surgical Unveils da Vinci Xi Successor with AI-Assisted Anatomy Recognition",
      summary: "The new da Vinci surgical platform incorporates real-time AI anatomy recognition that highlights critical structures during surgery, aiming to reduce complications and shorten surgeon learning curves."
    },
    zh: {
      title: "直觉外科发布新一代 da Vinci Xi 手术机器人：搭载 AI 辅助解剖识别系统",
      summary: "新一代 da Vinci 手术平台集成实时 AI 解剖识别功能，在手术中突出显示关键组织结构，旨在减少并发症并缩短外科医生学习曲线。"
    }
  },
  {
    slug: "micro-robots-drug-delivery",
    date: "2026-05-20",
    category: "medical",
    featured: false,
    en: {
      title: "Magnetic Micro-Robots Deliver Chemotherapy Directly to Tumors in First Human Trial",
      summary: "ETH Zurich spin-off Microsenso reports successful Phase I trial results for magnetically-guided micro-robots that navigate blood vessels to deliver chemotherapy precisely at tumor sites, reducing systemic side effects by 80%."
    },
    zh: {
      title: "磁性微型机器人首次人体试验：将化疗药物直接输送至肿瘤",
      summary: "苏黎世联邦理工学院衍生公司 Microsenso 报告，磁导微型机器人成功完成 I 期临床试验，可在血管中导航，将化疗药物精确递送至肿瘤部位，将全身副作用降低 80%。"
    }
  },
  {
    slug: "mit-soft-actuator-breakthrough",
    date: "2026-04-30",
    category: "research",
    featured: false,
    en: {
      title: "MIT Soft Robotics Lab Develops Artificial Muscle That Matches Human Muscle Efficiency",
      summary: "MIT researchers create a hydraulically-amplified electrostatic actuator that achieves 49% energy efficiency — comparable to biological muscle — potentially enabling a new generation of dexterous, energy-efficient robots."
    },
    zh: {
      title: "MIT 软体机器人实验室研发出与人体肌肉效率相当的仿生人工肌肉",
      summary: "MIT 研究人员创造了一种液压放大静电致动器，能量效率达 49%——与生物肌肉相当——有望开启新一代灵巧、高能效机器人。"
    }
  },
  {
    slug: "boston-dynamics-atlas-electric-update",
    date: "2026-02-20",
    category: "research",
    featured: false,
    image: "image/波士顿动力全电动 Atlas 展示惊人敏捷性：首个量产就绪演示发布.jpeg",
    en: {
      title: "Boston Dynamics' All-Electric Atlas Shows Stunning Agility in First Production-Ready Demos",
      summary: "Boston Dynamics reveals production-ready electric Atlas performing parkour, heavy lifting, and autonomous factory work, proving the all-electric humanoid is ready for commercial deployment."
    },
    zh: {
      title: "波士顿动力全电动 Atlas 展示惊人敏捷性：首个量产就绪演示发布",
      summary: "波士顿动力发布量产就绪的电动 Atlas 跑酷、重物搬运和自主工厂作业演示视频，证明全电动人形机器人已准备好商业部署。"
    }
  },
  {
    slug: "genesis-ai-gene-26-5",
    date: "2026-05-26",
    category: "ai-robotics",
    featured: true,
    image: "image/Genesis AI 携 1.05 亿美元融资从隐身模式浮出：能做饭、弹钢琴、单手解魔方的机器人大脑来了.png",
    en: {
      title: "Genesis AI Emerges From Stealth With $105M and a Robot Brain That Cooks, Plays Piano, and Cracks Eggs",
      summary: "Genesis AI unveils GENE-26.5, a vision-language-action foundation model that gives robots human-level dexterity — demonstrated by cooking a 20-step meal, playing piano, and solving a Rubik's Cube one-handed."
    },
    zh: {
      title: "Genesis AI 携 1.05 亿美元融资从隐身模式浮出：能做饭、弹钢琴、单手解魔方的机器人大脑来了",
      summary: "Genesis AI 发布 GENE-26.5 视觉-语言-动作基础模型，赋予机器人人类级灵巧操作能力——现场演示了烹饪 20 道工序早餐、高速弹钢琴、单手解魔方，并获 1.05 亿美元种子轮融资。"
    }
  },
  {
    slug: "mitsubishi-physical-ai-2026",
    date: "2026-05-26",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "Mitsubishi Electric Bets Big on Physical AI, Partners With Chiba Institute to Build Japan's Homegrown Robot Brain",
      summary: "Mitsubishi Electric and Chiba Institute of Technology announce a three-year co-research agreement to develop Japan's own Physical AI platform for humanoid robots, multi-legged walkers, and autonomous drones."
    },
    zh: {
      title: "三菱电机押注 Physical AI，联手千叶工业大学打造日本自主机器人大脑",
      summary: "三菱电机与千叶工业大学签署三年期联合研发协议，开发日本自主的 Physical AI 平台，覆盖人形机器人、多足行走机器人和自主无人机——标志着日本正式加入全球机器人 AI 竞赛。"
    }
  },
  {
    slug: "byd-humanoid-robot-2026",
    date: "2026-05-27",
    category: "humanoid",
    featured: true,
    en: {
      title: "BYD Joins the Humanoid Robot Race: EV Giant Confirms It's Building Robots for Homes and Showrooms",
      summary: "BYD Executive VP Li Ke reveals the company is developing humanoid robots for household use and 4S store customer service — making the world's largest EV maker the latest tech giant to bet on general-purpose robots."
    },
    zh: {
      title: "比亚迪正式入局人形机器人：李柯透露正开发家用机器人，将在 4S 店率先落地",
      summary: "比亚迪执行副总裁李柯 5 月 27 日透露，公司正在开发人形机器人，未来家庭可有多台分工机器人，短期内将率先在比亚迪 4S 店担任导购——全球最大电动车制造商正式跨界人形机器人赛道。"
    }
  },
  {
    slug: "engineai-humanoid-factory-2026",
    date: "2026-05-28",
    category: "humanoid",
    featured: true,
    en: {
      title: "One Humanoid Robot Every 15 Minutes: ENGINEAI Opens China's First Mass-Production Humanoid Factory",
      summary: "Shenzhen-based ENGINEAI opens a 129,000 sq ft smart factory capable of producing one T800 humanoid robot every 15 minutes, with a 10,000-unit production line planned in Zhengzhou after a $200M Series B round."
    },
    zh: {
      title: "每 15 分钟一台人形机器人：ENGINEAI 深圳超级工厂投产，郑州万台年产线同步规划中",
      summary: "深圳机器人公司 ENGINEAI 开设 1.2 万平方米智能制造工厂，每 15 分钟下线一台 T800 人形机器人，经 79 道质检和 46 项仿真测试。同步规划郑州万台年产能基地，B 轮融资 2 亿美元。"
    }
  },
  {
    slug: "nvidia-gtc-2026-40t-robotics",
    date: "2026-05-30",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "Jensen Huang Drops a $40 Trillion Number: NVIDIA's Robot Empire Is No Longer Just About Chips",
      summary: "At GTC 2026, NVIDIA CEO Jensen Huang declared the automation market worth $40 trillion, unveiled the Vera Rubin platform 40 million times faster than DGX-1, and brought a free-roaming Disney Olaf robot on stage — signaling that NVIDIA is becoming the operating system of the physical world."
    },
    zh: {
      title: "黄仁勋抛出 40 万亿美元数字：英伟达的机器人帝国不再只是芯片",
      summary: "GTC 2026 大会上，黄仁勋宣称自动化市场规模达 40 万亿美元，发布比 DGX-1 快 4000 万倍的 Vera Rubin 平台，并让迪士尼雪宝机器人自主走上舞台——英伟达正在成为物理世界的操作系统。"
    }
  },
  {
    slug: "hyundai-atlas-worldcup-2026",
    date: "2026-05-29",
    category: "humanoid",
    featured: true,
    en: {
      title: "Hyundai's Atlas Humanoid Robot Masters the Rabona Kick — and 33 Million People Can't Stop Watching",
      summary: "Hyundai Motor's all-electric Atlas humanoid robot stuns the world with a World Cup campaign featuring a 'ghost rabona' kick learned through reinforcement learning, racking up 33 million views while the company plans 25,000+ factory deployments starting 2028."
    },
    zh: {
      title: "现代 Atlas 人形机器人踢出「幽灵 Rabona」——3300 万人看得停不下来",
      summary: "现代汽车全电动 Atlas 人形机器人在世界杯营销活动中踢出一记通过强化学习掌握的「幽灵 Rabona」，五天累计 3300 万次观看，同时公司计划 2028 年起在工厂部署超 25000 台 Atlas。"
    }
  }
];

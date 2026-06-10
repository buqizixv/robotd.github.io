const SITE_NAME="Robot D",SITE_TAGLINE_EN="Your Daily Pulse on Robotics & AI",SITE_TAGLINE_ZH="机器人每日快讯",CATEGORIES=[{"slug":"all","en":"All Articles","zh":"全部文章","icon":""},{"slug":"humanoid","en":"Humanoid Robots","zh":"人形机器人","icon":"images/icon-humanoid.svg"},{"slug":"industrial","en":"Industrial Automation","zh":"工业自动化","icon":"images/icon-industrial.svg"},{"slug":"ai-robotics","en":"AI & Robotics","zh":"AI与机器人","icon":"images/icon-ai-robotics.svg"},{"slug":"drones","en":"Drones & UAVs","zh":"无人机","icon":"images/icon-drones.svg"},{"slug":"medical","en":"Medical Robotics","zh":"医疗机器人","icon":"images/icon-medical.svg"},{"slug":"research","en":"Research & Breakthroughs","zh":"研究突破","icon":"images/icon-research.svg"}],ARTICLE_MANIFEST=[
{
  slug: "squirreldrone-bioinspired-morphing-2026",
  date: "2026-06-10",
  category: "drones",
  featured: false,
  image: "",
  en: {
    title: "The Squirrel That Taught a Drone to Fly: TU Delft Abandons Bird Logic for a Whole-Body Morphing Breakthrough",
    summary: "TU Delft researchers published a Nature Communications paper introducing the SquirrelDrone, a bio-inspired flying robot that uses whole-body morphing — reshaping limbs, spine, tail, and membrane mid-flight — to achieve unprecedented agility, stability, and maneuverability.",
    keywords: "SquirrelDrone, TU Delft, flying squirrel, bio-inspired drone, whole-body morphing, Nature Communications, Salua Hamaza, Liming Zheng, morphing aircraft, drone agility",
    imageAlt: "The SquirrelDrone, a bio-inspired morphing drone with four limbs and a flexible membrane, in flight against a clear sky"
  },
  zh: {
    title: "当无人机学会「变全身」：荷兰科学家扔掉鸟类的说明书，从飞鼠身上找到了飞行新逻辑",
    summary: "代尔夫特理工大学在《自然·通讯》发表松鼠无人机（SquirrelDrone）——全球首款通过全身变形（四肢、脊柱、尾巴、柔性膜）实现飞行的仿生无人机，在敏捷性、机动性和稳定性上均取得突破性提升。这或许意味着，四十年来「向鸟学飞」的无人机设计路线，第一次遇到了真正的挑战者。",
    keywords: "松鼠无人机, SquirrelDrone, 代尔夫特理工大学, 飞鼠仿生, 全身变形, Nature Communications, Salua Hamaza, 郑黎明, 变形飞行器, 无人机敏捷性",
    imageAlt: "松鼠无人机在蓝天中飞行，四个肢体伸展，柔性膜展开"
  }
},
{
  slug: "intercontinental-telesurgery-cilr-2026",
  date: "2026-06-04",
  category: "medical",
  featured: true,
  image: "",
  en: {
    title: "Rome Surgeon Operates on Beijing Patient: The 8,200-km Telesurgery That Just Redefined What's Possible",
    summary: "A Chinese surgical team completed the world's first intercontinental remote tumor thrombectomy with IVC reconstruction — surgeon in Rome, patient 8,200 km away in Beijing, 143ms latency — at CILR 2026.",
    keywords: "telesurgery, remote surgery, CILR 2026, Edge Medical, robotic surgery, IVC tumor thrombectomy, Zhang Xu, Qingbo Huang, intercontinental surgery, surgical robot, telemedicine",
    imageAlt: "Professor Huang Qingbo operating a robotic surgical console in Rome while the patient lies on an operating table in Beijing",
    imageCredit: "",
    body: "<p>On June 4, 2026, in a packed auditorium in Rome, a surgeon sat at a console and began operating. Nothing unusual — except the patient was 8,200 kilometers away in Beijing. The procedure: removal of a tumor thrombus from the inferior vena cava, one of urology's most unforgiving operations. The audience of over 1,000 surgeons from 60 countries watched in silence as robotic arms moved across two continents in near-perfect synchrony. No one in the room had ever seen anything like it. Because no one had.</p><p>This was the 22nd Congress of Laparoscopic and Robotic Surgery Challenges and Artificial Intelligence — CILR 2026. And what happened on that stage wasn't a demonstration. It was a live human surgery, broadcast in real time, with a patient's life on the line and the global urology community as witness.</p><h2>The Surgeon, the Machine, and 20,000 Kilometers of Fiber</h2><p>Professor Huang Qingbo of the Chinese PLA General Hospital sat at the console in Rome's Regina Elena National Cancer Institute. Across the Eurasian landmass, in a Beijing operating room, the Edge Medical surgical robot — developed by the Shenzhen-based company Jingfeng Medical — translated every movement of his hands into precise instrument motion. The bidirectional communication path spanned more than 20,000 kilometers. System latency: approximately 143 milliseconds.</p><p>That number — 143 milliseconds — is the difference between a telesurgery that works and one that doesn't. Below roughly 200ms, a surgeon can compensate intuitively. Above it, the lag becomes dangerous. Two years ago, the same team achieved what was then a breakthrough: 130ms on a Rome-to-Beijing link. The fact that they've now repeatedly operated within this window, on progressively harder cases, tells you the technology has crossed from experimental to operational.</p><h2>Why IVC Tumor Thrombectomy Is the Mount Everest of Urology</h2><p>Renal cell carcinoma with inferior vena cava tumor thrombus is not just a kidney cancer. It's a cancer that has grown a tendril into the body's largest vein, stretching toward the heart. Removing it means clamping the vena cava, extracting the thrombus, and reconstructing the vessel wall — all within a finite window before organs downstream start suffering from blocked blood flow. The IVC sits next to the liver, pancreas, and duodenum. One wrong move and the patient can bleed out in minutes.</p><p>Doing this procedure robotically is already considered the pinnacle of urologic surgery. Doing it remotely, with the surgeon on another continent, had never been attempted. The fact that it succeeded — under live broadcast, with no safety net — is a statement about the maturity of both the surgical team and the robotic platform.</p><h2>Three Years, Three World Firsts</h2><p>This wasn't a one-off stroke of luck. Academician Zhang Xu's team at PLA General Hospital has now made history at CILR for three consecutive years. In 2024, they performed the world's first intercontinental ultra-remote human surgery — proving the concept was feasible. In 2025, Professor Ma Xin completed a live robot-assisted IVC tumor thrombectomy combined with radical left nephrectomy — proving it was practical for complex cases. Now, 2026, they've taken on the hardest challenge in the book: an intercontinental remote tumor thrombectomy with IVC reconstruction.</p><p>The trajectory is clear. From \"can we connect the machines?\" to \"can we handle real pathology?\" to \"can we tackle the single hardest procedure in urology?\" — and the answer at every step has been yes. This is what technology adoption curves look like when the engineering is sound and the clinical team knows exactly what they're doing.</p><h2>The Robot Behind the Headlines</h2><p>Edge Medical's surgical robot is not a household name like the da Vinci system, but it's carving out a distinct identity in remote surgery. The Edge Cloud telesurgery platform handles the data pipeline — video, haptic feedback, instrument control — across intercontinental distances with enough reliability that surgeons are willing to stake their reputations on live broadcasts. That's a level of trust no white paper can manufacture.</p><p>The CILR conference itself ran seven robotic platforms simultaneously, completing 40 live surgeries over three days. Edge wasn't the only robot in the room, but it was the one attempting — and pulling off — the hardest assignment.</p><h2>What This Means for the Next Decade</h2><p>Remote surgery has been a promise for twenty years. The barriers were always the same: latency, reliability, bandwidth, cost, regulation. CILR 2026 showed that at least three of those — latency, reliability, bandwidth — are now solved well enough for the most complex procedures. The remaining two — cost and regulation — are policy problems, not physics problems.</p><p>The implications go beyond urology. If a surgeon in Rome can operate on a patient in Beijing, then a specialist in Boston can assist a trauma case in rural Montana. A neurosurgeon in Tokyo can guide a procedure in Jakarta. The geography of surgical expertise becomes irrelevant. What matters is whether the fiber connection is good enough — and for increasingly many places on Earth, it is.</p><p>The CILR audience understood what they were watching. This wasn't just a record-setting surgery. It was a glimpse of a future where the phrase \"the best surgeon for this procedure\" doesn't end with \"but they're on the other side of the world.\"</p>"
  },
  zh: {
    title: "罗马医生给北京患者开刀：8200公里的手术刀，切开了远程医疗的天花板",
    summary: "中国手术团队在CILR 2026完成全球首例跨洲际远程癌栓取出加下腔静脉重建术——主刀医生在罗马，患者在北京，系统延迟143毫秒，张旭院士团队连续第三年创造历史。",
    keywords: "远程手术, 机器人手术, CILR 2026, 精锋医疗, 癌栓取出, 下腔静脉重建, 张旭, 黄庆波, 跨洲手术, 手术机器人, 远程医疗",
    imageAlt: "黄庆波教授在罗马操控手术机器人控制台，患者躺在北京的手术台上",
    imageCredit: "",
    body: "<p>手术室里没有主刀医生。</p><p>2026年6月4日下午，罗马。第22届腹腔镜、机器人及人工智能挑战大会（CILR）的主会场座无虚席。台上有一张控制台，台前坐着一位中国医生——解放军总医院的黄庆波教授。台下，来自60多个国家的1000多名泌尿外科医生屏息注视大屏幕。屏幕上显示的，是8200公里外北京某手术室内的实时画面：一名肾癌患者静卧台上，肿瘤已经顺着肾静脉爬进了下腔静脉，像一条危险的藤蔓伸向心脏。</p><p>黄庆波的手开始移动。北京手术室里的精锋手术机器人应声而动。没有延迟，没有抖动，没有意外。两个小时之后，癌栓取出，下腔静脉重建完毕。会场爆发出掌声。全球首例跨洲际远程癌栓取出加下腔静脉重建术，成了。</p><h2>一场手术，三条命脉</h2><p>肾癌伴下腔静脉癌栓，在泌尿外科被称为「皇冠上的明珠」——换个说法，就是最难的那一类。它不是你切掉一个肾就完事。癌栓顺着人体最大的静脉往上爬，你必须截断下腔静脉、精准剥离癌栓、再重建血管壁。而旁边紧挨着肝、胰腺、十二指肠。手术窗口极短——一旦血管阻断，下游器官就在倒计时。稍有差池，病人可能几分钟内失血致死。</p><p>用机器人做这个手术，已经是顶尖泌尿外科团队的看家本事。隔着8200公里做——此前没人试过。黄庆波敢在CILR的全球直播中做这台手术，不是胆子大，是底气足。</p><h2>143毫秒，一个被反复验证的数字</h2><p>远程手术的核心难题永远是延迟。人的神经系统本身就有约100毫秒的传导延迟，所以外科医生对200毫秒以内的操作滞后是可以直觉补偿的。超过这个阈值，手感就不对了。两年前，张旭团队首次实现罗马到北京的远程手术时，系统延迟约130毫秒——那已经是当时全球远程手术的最低记录。今年的手术，精锋云远程手术系统将延迟控制在143毫秒左右，双向通信距离超过2万公里。</p><p>143毫秒是什么概念？你眨一下眼大概需要300毫秒。也就是说，把指令从罗马发到北京、让机器臂做出动作、再把视频传回罗马——这整个来回，还不够你眨半次眼。</p><h2>三年，三级跳</h2><p>CILR被业内称为「机器人泌尿外科的超级碗」。能在这个舞台上做直播手术，意味着你的团队、你的机器人、你的通信系统必须经得起全球同行的实时审视——没有任何犯错空间，全世界盯着你看。</p><p>张旭院士的团队已经连续三年在这个舞台上创造历史。2024年，全球首例跨洲超远程人体手术——证明「远程可行」。2025年，马鑫教授完成机器人辅助IVC癌栓取出加左肾根治性切除术的全球直播——证明「复杂病例也可行」。2026年，黄庆波教授挑战跨洲远程癌栓加下腔静脉重建——证明「最难的手术也行」。三级跳，每一步都在推高远程手术的天花板。</p><h2>机器人不是噱头，是答案</h2><p>精锋医疗的手术机器人名气不如达芬奇系统大，但在远程手术这个垂直赛道上，它正在建立自己的护城河。精锋云远程手术系统承担的不是简单的视频传输，而是视频、触觉反馈、器械控制三条数据流的同步压缩与传输，在洲际光纤上来回跑。一个外科医生愿意在CILR全球直播中把自己的声誉押在这个系统上——这种级别的信任，不是白皮书和论文能建立的。</p><p>CILR 2026共动用了7个机器人平台，三天完成了40台直播手术。精锋不是唯一的机器人，但它承担的是最难的那一台。</p><h2>远程手术的「最后一公里」不是技术</h2><p>远程手术被讨论了二十年。二十年里，挡路的水远是那几样：延迟、可靠性、带宽、成本、监管。CILR 2026传递的信号很明确——前三个已经解决了，至少解决到了能应对最高难度手术的程度。剩下来的成本问题是个规模问题，监管问题是个政策问题。都不是物理定律的限制。</p><p>这意味着什么？如果一个罗马的医生能为北京的患者做手术，那么上海三甲医院的专家就能为甘肃县城的患者做手术。波士顿的神经外科医生能为蒙大拿乡村的创伤病人提供术中指导。东京的专家能为雅加达的手术室做远程协作。手术专长的地理边界正在消失。唯一需要问的问题是：光纤够不够好？而对地球上越来越多的地方来说，答案是：够了。</p><p>那天在罗马坐着的1000多位外科医生，看到的不仅是一台创纪录的手术。他们看到的，是一个不再需要把「最好的医生」和「隔着一片海」放在同一句话里的未来。</p>"
  }
},
  {
    slug: "neoVerse-abot-world-model-icra-2026",
    date: "2026-06-09",
    category: "ai-robotics",
    featured: false,
    en: {
      title: "The Robot That Thinks Before It Acts: How NeoVerse-ABot Solved Action Hallucination at ICRA 2026",
      summary: "The Chinese Academy of Sciences' NeoVerse-ABot team won the World Model track at ICRA 2026 with a 0.829 score, solving the 'action hallucination' problem that plagued robot world models — enabling robots to simulate physical outcomes in their 'mind' before acting."
    },
    zh: {
      title: "先想后动：中科院 NeoVerse-ABot 破解机器人「动作幻觉」难题，夺 ICRA 2026 世界模型冠军",
      summary: "中国科学院自动化研究所 NeoVerse-ABot 团队在 ICRA 2026 世界模型赛道以 0.829 分夺冠，526 支队伍中排名第一。核心突破是解决了机器人世界模型的「动作幻觉」问题——让机器人能在行动前在「脑海」中准确推演物理结果。"
    }
  },
  {
    slug: "global-robotaxi-tipping-point-2026",
    date: "2026-06-08",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "The Robotaxi Tipping Point: Why June 2026 Is When Autonomous Mobility Went Global",
      summary: "NVIDIA, Waymo, Tesla, and Chinese players are simultaneously accelerating robotaxi deployments worldwide. June 2026 marks the moment the industry shifted from proving autonomy to scaling it. A comprehensive analysis of the inflection point."
    },
    zh: {
      title: "自动驾驶出租车临界点已至：2026年6月，无人出行全球化的真正开端",
      summary: "英伟达、Waymo、特斯拉和中国玩家同时加速全球Robotaxi部署。2026年6月标志着行业从“证明自动驾驶可行”转向“证明自动驾驶可规模化”。本文从技术、资本、政策和竞争格局四个维度解析这一历史性时刻。"
    }
  },
  {
    slug: "skild-ai-foundation-model-2026",
    date: "2026-06-08",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "Skild AI Unleashes the First Universal Robot Brain",
      summary: "Skild AI launches Skild Brain 1.0, a 500-billion-parameter robot foundation model trained on 10,000 robots across 200 hardware platforms — and it works on robots it has never seen before."
    },
    zh: {
      title: "Skild AI 发布通用机器人大脑：5000亿参数的具身智能里程碑",
      summary: "Skild AI 推出 Skild Brain 1.0，基于 10,000 台机器人、200 多种硬件平台的真实数据训练，无需针对新机器人微调即可直接部署。"
    }
  },
  {
    slug: "eternal-ag-harvester-greenhouse-2026",
    date: "2026-06-07",
    category: "industrial",
    featured: true,
    en: {
      title: "The Robot That Works 22-Hour Shifts: Inside Eternal.ag's Bid to Automate the Greenhouse",
      summary: "German startup Eternal.ag deploys fully autonomous tomato-harvesting robots in Dutch greenhouses, raises €8M, and partners with seed giant Rijk Zwaan to solve Europe's agricultural labor crisis from the root up."
    },
    zh: {
      title: "22 小时不停歇的温室机器人：德国创业公司 Eternal.ag 如何用全自主机器人解决欧洲农业用工荒",
      summary: "德国农业科技公司 Eternal.ag 在荷兰温室部署全自主番茄采摘机器人，获 800 万欧元融资，并与种子巨头 Rijk Zwaan 合作，试图从作物基因层面推进温室自动化。"
    }
  },
  {
    slug: "robot-data-wars-2026",
    date: "2026-06-06",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "The Robot Data Wars: Why Training Data, Not Model Architecture, Is Now the Moat in Embodied AI",
      summary: "As foundation models converge on similar architectures, the real differentiator in robotics AI has shifted to who owns the largest, most diverse robot manipulation datasets — and the race is heating up."
    },
    zh: {
      title: "机器人数据争夺战：为什么训练数据正在超越模型架构，成为具身智能的真正护城河",
      summary: "当基础模型架构趋于收敛，机器人AI的真正分水岭转向了谁拥有最大、最多样的操作数据集——这场竞赛正在升温。"
    }
  },
  {
    slug: "bike-robot-front-flip-2026",
    date: "2026-06-05",
    category: "research",
    featured: true,
    image: "image/bicycle-robot-front-flip-icra-2026.gif",
    en: {
      title: "A Bicycle Robot Did a Front Flip. The Hard Part Was Landing.",
      summary: "Georgia Tech and RAI Institute's bicycle robot achieves world-first unassisted front flip at ICRA 2026 via Iterative Motion Imitation, learning from deliberately imperfect trajectories."
    },
    zh: {
      title: "自行车机器人完成全球首个前空翻：不完美的起点，迭代出的极限运动",
      summary: "Georgia Tech 博士生在 RAI Institute 实习期间，让一台自行车机器人完成了全球首个无人辅助的 360 度前空翻。背后是一套名为「迭代运动模仿」的方法——从一段糟糕的轨迹开始，越迭代越强。"
    }
  },
  {
    slug: "byd-humanoid-robot-2026",
    date: "2026-06-05",
    category: "humanoid",
    featured: true,
    en: {
      title: "BYD Officially Enters Humanoid Robotics: What It Means for the Industry",
      summary: "China's largest EV maker BYD confirms development of humanoid robots, leveraging automotive AI and strategic investments to enter the fast-growing embodied intelligence market."
    },
    zh: {
      title: "比亚迪正式入局人形机器人：对行业意味着什么",
      summary: "中国最大电动汽车制造商比亚迪确认正在开发人形机器人，借助汽车AI能力和战略投资进入快速增长的人形机器人市场。"
    }
  },
  {
    slug: "rapid-neural-evolution-robot-gait-2026",
    date: "2026-06-05",
    category: "research",
    featured: true,
    en: {
      title: "11 Minutes to a New Gait: The Algorithm That Lets Robots Evolve Past Their Own Damage",
      summary: "UC Berkeley and ETH Zurich unveil a rapid neural evolution algorithm that lets a damaged six-legged robot discover a completely novel gait on physical hardware in 11 minutes — evolving neural network weights in real time, not in simulation."
    },
    zh: {
      title: "11分钟长出全新步态：让破损机器人自己进化出行走能力的算法",
      summary: "UC Berkeley 与 ETH Zurich 联合团队提出快速神经进化算法，让一台六足机器人在腿部执行器失效后，仅用11分钟就在真实硬件上进化出全新的五足步态——不依赖仿真，不依赖损伤诊断，从零开始。"
    }
  },
  {
    slug: "nvidia-cosmos-3-2026",
    date: "2026-06-04",
    category: "ai-robotics",
    featured: false,
    en: {
      title: "The Omnimodel Is Here: Inside NVIDIA Cosmos 3, the Open Foundation for Physical AI",
      summary: "NVIDIA launches Cosmos 3, the first fully open-source 'omnimodel' for Physical AI — a Mixture-of-Transformers foundation model that processes text, images, video, sound, and action trajectories in a single unified architecture."
    },
    zh: {
      title: "全能模型降临：英伟达 Cosmos 3 开源物理 AI 基座模型深度解读",
      summary: "英伟达发布 Cosmos 3，全球首个完全开源的物理 AI「全能模型」——基于 Mixture-of-Transformers 双塔架构，统一处理文本、图像、视频、环境音和动作轨迹。"
    }
  },
  {
    slug: "apptronik-apollo-warehouse-2026",
    date: "2026-06-02",
    category: "humanoid",
    featured: true,
    en: {
      title: "The Pragmatist's Humanoid: Why Mercedes, Google, and Deere Are Betting on Apptronik's Apollo",
      summary: "Apptronik's Apollo humanoid deployed at Mercedes-Benz and GXO in 2026, backed by Google, Deere, and $935M. The NASA-born robot bets pragmatism over spectacle."
    },
    zh: {
      title: "Apollo 落地：人形机器人赛道上，那个最务实的选手悄悄攒了一手好牌",
      summary: "2026 年，Apptronik 的 Apollo 人形机器人在奔驰和 GXO 仓库实地部署，背后是谷歌、奔驰、约翰迪尔和 9.35 亿美元融资。这家 NASA 技术转化的创业公司正在用人形机器人的务实路线赢得工业界的信任。"
    }
  },
  {
    slug: "nvidia-unitree-open-humanoid-2026",
    date: "2026-06-02",
    category: "humanoid",
    featured: true,
    en: {
      title: "NVIDIA, Unitree, and Sharpa Launch the First Open Humanoid Robot Reference Platform",
      summary: "At Computex 2026, NVIDIA partnered with China's Unitree Robotics and Singapore's Sharpa to release the Isaac GR00T Reference Humanoid — an open, full-stack platform for academic research that could become the Android of humanoid robotics."
    },
    zh: {
      title: "英伟达、宇树、Sharpa 联合发布首个开源人形机器人参考平台：机器人界的 Android 时刻",
      summary: "2026 年 6 月 1 日，英伟达在 Computex Taipei 宣布与宇树科技和新加坡 Sharpa 合作，推出 Isaac GR00T 参考人形机器人平台——首个面向学术研究的开源全栈人形机器人方案，或将成为人形机器人界的 Android。"
    }
  },
  {
    slug: "agility-digit-warehouse-2026",
    date: "2026-06-01",
    category: "humanoid",
    featured: true,
    en: {
      title: "Agility's Digit Is the Only Humanoid Robot Actually Making Money in Warehouses Right Now",
      summary: "With 100,000+ totes moved at GXO, seven units deployed at Toyota Canada under a RaaS contract, and a cooperatively safe Digit coming late 2026, Agility is pulling ahead in the warehouse humanoid race."
    },
    zh: {
      title: "Digit 人形机器人悄然占领仓库：10 万次搬运之后，丰田开始付钱了",
      summary: "当其他人形机器人还在拍演示视频时，Agility 的 Digit 已在 GXO 仓库搬运超过 10 万个周转箱，并在丰田加拿大工厂签下商业合同。2026 年底「协作安全」版本将彻底打开仓库部署空间。"
    }
  },
  {
    slug: "openai-robotics-2026",
    date: "2026-06-01",
    category: "ai-robotics",
    featured: true,
    en: {
      title: "OpenAI Enters the Humanoid Race: Sam Altman's Bet on a Robot in Every Home",
      summary: "On June 1, 2026, OpenAI announced a new robotics division and began hiring hardware engineers — the same day NVIDIA unveiled its open reference humanoid. Two AI giants crossed the physical divide simultaneously. The race for the physical world just got real."
    },
    zh: {
      title: "OpenAI 正式入局人形机器人：奥特曼用一则招聘宣告物理世界争夺战开幕",
      summary: "2026 年 6 月 1 日，OpenAI 宣布成立机器人部门并大规模招聘硬件工程师；同日，英伟达发布开源参照人形机器人。两家 AI 巨头同一天跨越虚实分界，物理世界的竞赛正式拉开帷幕。"
    }
  },
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
      title: "每 15 分钟一台人形机器人：ENGINEAI 深圳超级工厂投产，郑州万台北产线同步规划中",
      summary: "深圳机器人公司 ENGINEAI 开设 1.2 万平方米智能制造工厂，每 15 分钟下线一台 T800 人形机器人，经 79 道质检和 46 项仿真测试。同步规划郑州万台年产能基地，B 轮融资 2 亿美元。"
    }
  },
  {
    slug: "genesis-ai-gene-26-5",
    date: "2026-05-26",
    category: "ai-robotics",
    featured: true,
    image: "image/genesis-ai-gene-26-5.webp",
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
      summary: "Mitsubishi Electric and Chiba Institute of Technology announce a three-year co-research agreement to develop Japan's own Physical AI platform for humanoid robots, multi-legged walkers, and autonomous drones — signaling Japan's intent to compete in the global robotics AI race."
    },
    zh: {
      title: "三菱电机押注 Physical AI，联手千叶工业大学打造日本自主机器人大脑",
      summary: "三菱电机与千叶工业大学签署三年期联合研发协议，开发日本自主的 Physical AI 平台，覆盖人形机器人、多足行走机器人和自主无人机——标志着日本正式加入全球机器人 AI 竞赛，与美国和中国展开竞争。"
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
    slug: "unitree-gd01-mecha",
    date: "2026-05-12",
    category: "humanoid",
    featured: true,
    image: "image/unitree-gd01-mecha.jpeg",
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
    slug: "deepmind-rt-3",
    date: "2026-05-05",
    category: "ai-robotics",
    featured: true,
    image: "image/deepmind-rt-3.jpeg",
    en: {
      title: "Google DeepMind's RT-3 Robot Foundation Model: One Brain, Dozens of Robots, Zero Retraining",
      summary: "DeepMind unveils Robotics Transformer 3 (RT-3), a vision-language-action foundation model that controls robots from 8 different manufacturers without per-robot fine-tuning, marking a turning point in generalist robot AI."
    },
    zh: {
      title: "Google DeepMind 发布 RT-3 机器人基础模型：一个大脑控制几十种机器人，无需重新训练",
      summary: "DeepMind 发布 Robotics Transformer 3 (RT-3)，这是一个视觉-语言-动作基础模型，无需按机器人微调即可控制来自 8 家不同制造商的机器人，标志着通用型机器人 AI 的转折点。"
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
    slug: "nvidia-groot-2026",
    date: "2026-04-08",
    category: "ai-robotics",
    featured: false,
    en: {
      title: "NVIDIA GR00T Goes Public: The Generalist Robot AI Platform Now Open to Developers Worldwide",
      summary: "NVIDIA opens its GR00T robot foundation model platform to all developers, providing a cloud-based training and deployment pipeline that could democratize generalist robot AI development."
    },
    zh: {
      title: "NVIDIA GR00T 平台向全球开发者开放：通用型机器人 AI 的民主化时刻",
      summary: "NVIDIA 向所有开发者开放 GR00T 机器人基础模型平台，提供基于云端的训练和部署流程，有望普及通用型机器人 AI 开发。"
    }
  }
];
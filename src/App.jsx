import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MuseumItem from './MuseumItem'
import SceneDecor from './SceneDecor'
import './styles.css'
import { translateText } from './translateService'

const I18N = {
  kk: {
    ui: {
      eyebrow: 'Қазақ мәдени мұрасы',
      artifactDescription: 'Экспонат сипаттамасы',
      prevHall: 'Алдыңғы зал',
      nextHall: 'Келесі зал',
      soundOn: '♪ Дыбыс қосулы',
      soundOff: '♪ Дыбыс өшірулі',
    },
    categories: [
      {
        id: 'clothing',
        title: 'Киім залы',
        subtitle: 'Дәстүрлі киімдер мен салтанатты бас киімдер',
        items: [
          {
            id: 0,
            path: '/taqiya.glb',
            name: 'Тақия',
            title: 'Тақия — дәстүрлі қазақ бас киімі',
            description:
              'Тақия — кесте және ою-өрнекпен безендірілетін дәстүрлі қазақ бас киімі. Ол қазақ мәдениетіндегі эстетиканы, күнделікті өмірді және өңірлік ерекшелікті көрсетеді.',
          },
          {
            id: 1,
            path: '/saukele.glb',
            name: 'Сәукеле',
            title: 'Сәукеле — салтанатты қалыңдық бас киімі',
            description:
              'Сәукеле — қазақтың үйлену дәстүріндегі ең айшықты бұйымдардың бірі. Ол мәртебені, сұлулықты, отбасылық дәстүрді және рәсімдік қадірді бейнелейді.',
          },
          {
            id: 2,
            path: '/shapan.glb',
            name: 'Шапан',
            title: 'Шапан — салтанатты сырт киім',
            description:
              'Шапан — құрметтің, қонақжайлықтың және мерекелік сәннің нышаны. Оның материалы мен оюы қазақ киім мәдениетінің байлығын танытады.',
          },
          {
            id: 8,
            path: '/kamzol.glb',
            name: 'Әйел камзолы',
            title: 'Әйел камзолы — дәстүрлі мерекелік киім',
            description:
              'Қазақ әйелінің камзолы — белге қонымды, кестемен, зермен және ою-өрнекпен әшекейленген сырт киім. Ол иесінің жасын, әлеуметтік мәртебесін және өңірлік дәстүрін айқындайтын, той-думандар мен салтанатты рәсімдерде киілетін сәндік әрі мағыналық мәні зор киім саналады.',
          },
        ],
      },
      {
        id: 'music',
        title: 'Музыка залы',
        subtitle: 'Ұлы даланың рухани және музыкалық мұрасы',
        items: [
          {
            id: 3,
            path: '/dombra.glb',
            name: 'Домбыра',
            title: 'Домбыра — Ұлы даланың үні',
            description:
              'Домбыра — қазақ музыкалық мәдениетінің басты белгілерінің бірі. Күйлер, ауызша тарих және дала жады ұрпақтан ұрпаққа осы аспап арқылы жеткен.',
          },
          {
            id: 4,
            path: '/qobyz.glb',
            name: 'Қобыз',
            title: 'Қобыз — көне киелі аспап',
            description:
              'Қобыз — рухани дәстүрмен, эпикалық жыр айтумен және терең әсерлі үнімен байланысты көне ысқылы аспап.',
          },
        ],
      },
      {
        id: 'tradition',
        title: 'Дәстүр залы',
        subtitle: 'Көшпелі өмір, ұлттық ойындар және күнделікті мұра',
        items: [
          {
            id: 5,
            path: '/asyq.glb',
            name: 'Асық',
            title: 'Асық — дәстүрлі ойын және халық жады',
            description:
              'Асық балалар ойынын, ептілікті, жарысты және әлеуметтік қарым-қатынасты бейнелейді. Бұл — халықтық дәстүрдің ең танымал белгілерінің бірі.',
          },
          {
            id: 6,
            path: '/qamshy.glb',
            name: 'Қамшы',
            title: 'Қамшы — дала мәдениетінің дәстүрлі құралы',
            description:
              'Қамшы жылқы мәдениетімен, көшпелі өмірмен және дәстүрлі шеберлікпен тығыз байланысты. Ол қозғалысты, сапарды және дала болмысын білдіреді.',
          },
          {
            id: 7,
            path: '/yurt.glb',
            name: 'Киіз үй',
            title: 'Киіз үй — көшпелі үйдің символы',
            description:
              'Киіз үй — қазақ өркениетінің ең қуатты нышандарының бірі. Ол отбасыны, қонақжайлықты, мобильділікті және көшпелі өмір құрылымын бейнелейді.',
          },
          {
            id: 9,
            path: '/sedlo.glb',
            name: 'Ер-тұрман',
            title: 'Ер-тұрман — қазақтың ат әбзелдері',
            description:
              'Қазақ ер-тұрманы — ат пен адамның біртұтас қозғалысын қамтамасыз ететін күрделі әбзелдер жиынтығы. Ағаш қаңқалы ер, өрнекті қас, өрілген тебінгі мен айыл-құйысқан көшпелі өмір салтын, шебер ұсталардың қолөнерін және жылқыға деген ерекше құрметті көрсетеді.',
          },
          {
            id: 10,
            path: '/chest_lootbox.glb',
            name: 'Сандық',
            title: 'Сандық — тұрмыстық және сәндік жүк сақтағыш',
            description:
              'Қазақ сандығы — киім-кешек пен қымбат бұйымдарды сақтауға арналған ағаш жүк қорабы. Ол ою-өрнекпен, темір өрімдермен және бояумен безендіріліп, қыз жасауымен бірге жүретін маңызды мүлік ретінде отбасының тұрмыс деңгейін, талғамын және ұрпақтан-ұрпаққа жалғасатын мұрасын бейнелейді.',
          },
        ],
      },
    ],
  },

  ru: {
    ui: {
      eyebrow: 'Казахское культурное наследие',
      artifactDescription: 'Описание экспоната',
      prevHall: 'Предыдущий зал',
      nextHall: 'Следующий зал',
      soundOn: '♪ Звук включён',
      soundOff: '♪ Звук выключен',
    },
    categories: [
      {
        id: 'clothing',
        title: 'Зал одежды',
        subtitle: 'Традиционные костюмы и церемониальные головные уборы',
        items: [
          {
            id: 0,
            path: '/taqiya.glb',
            name: 'Тақия',
            title: 'Тақия — традиционный казахский головной убор',
            description:
              'Тақия — традиционная казахская шапочка, украшенная вышивкой и орнаментом. Она отражает эстетику, повседневную жизнь и региональную идентичность в казахской культуре.',
          },
          {
            id: 1,
            path: '/saukele.glb',
            name: 'Сәукеле',
            title: 'Сәукеле — свадебный церемониальный головной убор',
            description:
              'Сәукеле — один из самых величественных элементов казахской свадебной культуры. Он символизирует статус, красоту, семейную традицию и торжественное достоинство.',
          },
          {
            id: 2,
            path: '/shapan.glb',
            name: 'Шапан',
            title: 'Шапан — церемониальная верхняя одежда',
            description:
              'Шапан — традиционная верхняя одежда, символизирующая честь, гостеприимство и праздничное достоинство. Материал и орнаментация раскрывают богатство казахской культуры одежды.',
          },
          {
            id: 8,
            path: '/kamzol.glb',
            name: 'Женский камзол',
            title: 'Женский камзол — праздничная традиционная одежда',
            description:
              'Женский казахский камзол — приталенная безрукавка или короткий кафтан, украшенный вышивкой, тесьмой и металлизированными вставками. Он подчёркивает стройность фигуры, отражает возраст и статус владелицы и традиционно надевается на праздники, торжества и важные семейные обряды.',
          },
        ],
      },
      {
        id: 'music',
        title: 'Музыкальный зал',
        subtitle: 'Духовное и музыкальное наследие Великой степи',
        items: [
          {
            id: 3,
            path: '/dombra.glb',
            name: 'Домбра',
            title: 'Домбра — голос Великой степи',
            description:
              'Домбра — один из главных символов казахской музыкальной культуры. Через неё передавались кюи, устная история и память степи из поколения в поколение.',
          },
          {
            id: 4,
            path: '/qobyz.glb',
            name: 'Қобыз',
            title: 'Қобыз — древний сакральный инструмент',
            description:
              'Қобыз — древний смычковый инструмент, связанный с духовной традицией, эпическим повествованием и глубоким эмоциональным звучанием в казахской культуре.',
          },
        ],
      },
      {
        id: 'tradition',
        title: 'Зал традиций',
        subtitle: 'Кочевая жизнь, игры и повседневное наследие',
        items: [
          {
            id: 5,
            path: '/asyq.glb',
            name: 'Асық',
            title: 'Асық — традиционная игра и народная память',
            description:
              'Асық отражает детские игры, ловкость, соревновательность и социальное взаимодействие. Это один из самых узнаваемых элементов народной традиции.',
          },
          {
            id: 6,
            path: '/qamshy.glb',
            name: 'Қамшы',
            title: 'Қамшы — традиционная плеть степной культуры',
            description:
              'Қамшы тесно связан с конной культурой, кочевой жизнью и традиционными навыками. Он символизирует движение, путь и степную идентичность.',
          },
          {
            id: 7,
            path: '/yurt.glb',
            name: 'Юрта',
            title: 'Юрта — символ кочевого дома',
            description:
              'Юрта — один из самых сильных символов казахской цивилизации. Она олицетворяет семью, гостеприимство, мобильность и устройство кочевой жизни.',
          },
          {
            id: 9,
            path: '/sedlo.glb',
            name: 'Конское седло',
            title: 'Конское седло — центр конной экипировки',
            description:
              'Казахское конское седло — ключевой элемент традиционной конной культуры, обеспечивающий удобство всадника и безопасность лошади. Богатая резьба по дереву, металлические накладки и кожаные ремни отражают вкус мастера и статус владельца, а также многовековой опыт кочевого образа жизни.',
          },
          {
            id: 10,
            path: '/chest_lootbox.glb',
            name: 'Сундук',
            title: 'Сундук — хранитель домашнего добра',
            description:
              'Традиционный сундук в казахском быту служил для хранения одежды, тканей, украшений и приданого невесты. Его украшают резьба, орнамент и металлические накладки, поэтому сундук одновременно является и функциональным предметом, и выразительным элементом интерьера кочевого или оседлого жилища.',
          },
        ],
      },
    ],
  },

  en: {
    ui: {
      eyebrow: 'Kazakh Cultural Heritage',
      artifactDescription: 'Artifact Description',
      prevHall: 'Previous Hall',
      nextHall: 'Next Hall',
      soundOn: '♪ Sound On',
      soundOff: '♪ Sound Off',
    },
    categories: [
      {
        id: 'clothing',
        title: 'Clothing Hall',
        subtitle: 'Traditional garments and ceremonial attire',
        items: [
          {
            id: 0,
            path: '/taqiya.glb',
            name: 'Taqiya',
            title: 'Taqiya — Traditional Kazakh Headwear',
            description:
              'Taqiya is a traditional Kazakh cap decorated with embroidery and ornamental motifs. It reflects aesthetics, daily life, and regional identity in Kazakh culture.',
          },
          {
            id: 1,
            path: '/saukele.glb',
            name: 'Saukele',
            title: 'Saukele — Ceremonial Bridal Headdress',
            description:
              'Saukele is one of the most magnificent elements of Kazakh wedding culture. It symbolizes status, beauty, family tradition, and ceremonial dignity.',
          },
          {
            id: 2,
            path: '/shapan.glb',
            name: 'Shapan',
            title: 'Shapan — Ceremonial Outer Garment',
            description:
              'Shapan is a traditional outer robe symbolizing honor, hospitality, and festive dignity. Its material and ornamentation reveal the richness of Kazakh clothing culture.',
          },
          {
            id: 8,
            path: '/kamzol.glb',
            name: 'Women’s kamzol',
            title: 'Women’s kamzol — festive traditional garment',
            description:
              'The Kazakh women’s kamzol is a fitted sleeveless coat or short jacket decorated with embroidery, braid and metal ornaments. It highlights the wearer’s silhouette, reflects her age and social status, and is worn on holidays, celebrations and important family ceremonies.',
          },
        ],
      },
      {
        id: 'music',
        title: 'Music Hall',
        subtitle: 'Spiritual and musical heritage of the Great Steppe',
        items: [
          {
            id: 3,
            path: '/dombra.glb',
            name: 'Dombra',
            title: 'Dombra — Voice of the Great Steppe',
            description:
              'Dombra is one of the main symbols of Kazakh musical culture. Through it, kuis, oral history, and the memory of the steppe were passed from generation to generation.',
          },
          {
            id: 4,
            path: '/qobyz.glb',
            name: 'Qobyz',
            title: 'Qobyz — Ancient Sacred Instrument',
            description:
              'Qobyz is an ancient bowed instrument associated with spiritual tradition, epic storytelling, and deep emotional sound in Kazakh culture.',
          },
        ],
      },
      {
        id: 'tradition',
        title: 'Tradition Hall',
        subtitle: 'Nomadic life, games, and everyday heritage',
        items: [
          {
            id: 5,
            path: '/asyq.glb',
            name: 'Asyq',
            title: 'Asyq — Traditional Game and Folk Memory',
            description:
              'Asyq reflects children’s games, dexterity, competition, and social interaction. It is one of the most recognizable elements of folk tradition.',
          },
          {
            id: 6,
            path: '/qamshy.glb',
            name: 'Qamshy',
            title: 'Qamshy — Traditional Whip of Steppe Culture',
            description:
              'Qamshy is closely connected with horse culture, nomadic life, and traditional skills. It represents movement, travel, and steppe identity.',
          },
          {
            id: 7,
            path: '/yurt.glb',
            name: 'Yurt',
            title: 'Yurt — Symbol of Nomadic Home',
            description:
              'Yurt is one of the strongest symbols of Kazakh civilization. It represents family, hospitality, mobility, and the structure of nomadic life.',
          },
          {
            id: 9,
            path: '/sedlo.glb',
            name: 'Saddle',
            title: 'Saddle — core of horse equipment',
            description:
              'The traditional Kazakh saddle is a central piece of horse tack that ensures the rider’s comfort and the horse’s safety. Its carved wooden frame, decorative metal fittings and leather straps express the craftsmanship of artisans, the owner’s status and the deep bond between nomads and their horses.',
          },
          {
            id: 10,
            path: '/chest_lootbox.glb',
            name: 'Chest',
            title: 'Chest — keeper of household treasures',
            description:
              'A traditional wooden chest in Kazakh households was used to store clothing, fabrics, jewellery and a bride’s dowry. Rich carving, painted ornament and metal details make it both a practical storage piece and a meaningful symbol of family wealth and heritage passed down through generations.',
          },
        ],
      },
    ],
  },
}

export const EXHIBIT_AUDIO_SOURCES = {
  kk: {
    0: '/audio/kz/taqiya.mp3',
    1: '/audio/kz/saukele.mp3',
    2: '/audio/kz/shapan.mp3',
    3: '/audio/kz/dombra.mp3',
    4: '/audio/kz/qobyz.mp3',
    5: '/audio/kz/asyq.mp3',
    6: '/audio/kz/qamshy.mp3',
    7: '/audio/kz/yurta.mp3',
    8: '/audio/kz/kamzol.mp3',
    9: '/audio/kz/sedlo.mp3',
    10: '/audio/kz/chest_lootbox.mp3',
  },
  ru: {
    0: '/audio/ru/taqiya.mp3',
    1: '/audio/ru/saukele.mp3',
    2: '/audio/ru/shapan.mp3',
    3: '/audio/ru/dombra.mp3',
    4: '/audio/ru/qobyz.mp3',
    5: '/audio/ru/asyq.mp3',
    6: '/audio/ru/qamshy.mp3',
    7: '/audio/ru/yurta.mp3',
    8: '/audio/ru/kamzol.mp3',
    9: '/audio/ru/sedlo.mp3',
    10: '/audio/ru/chest_lootbox.mp3',
  },
  en: {
    0: '/audio/en/taqiya.mp3',
    1: '/audio/en/saukele.mp3',
    2: '/audio/en/shapan.mp3',
    3: '/audio/en/dombra.mp3',
    4: '/audio/en/qobyz.mp3',
    5: '/audio/en/asyq.mp3',
    6: '/audio/en/qamshy.mp3',
    7: '/audio/en/yurt.mp3',
    8: '/audio/en/kamzol.mp3',
    9: '/audio/en/saddle.mp3',
    10: '/audio/en/chest_lootbox.mp3',
  },
}

function FloatingDust() {
  const ref = useRef()

  const particles = useMemo(() => {
    return Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: Math.random() * 7 + 0.5,
      z: (Math.random() - 0.5) * 10,
      size: Math.random() * 0.04 + 0.015,
      speed: Math.random() * 0.45 + 0.12,
    }))
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()

    ref.current.children.forEach((child, i) => {
      const p = particles[i]
      child.position.y = p.y + Math.sin(t * p.speed + i) * 0.12
      child.material.opacity = 0.04 + (Math.sin(t * 1.2 + i) + 1) * 0.03
    })
  })

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color="#efc56f" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}

function CameraRig({ activeId, categoryIndex, transitionPhase }) {
  const { camera } = useThree()

  useFrame(() => {
    const zBase = activeId !== null ? 11.8 : 13.6
    const yBase = activeId !== null ? 2.6 : 3.0

    const sideOffset =
      categoryIndex === 0 ? -0.12 : categoryIndex === 2 ? 0.12 : 0

    const transitionPush =
      transitionPhase === 'out' ? 0.8 : transitionPhase === 'in' ? 0.28 : 0

    const target = new THREE.Vector3(sideOffset, yBase, zBase + transitionPush)

    camera.position.lerp(target, 0.05)
    camera.lookAt(0, activeId !== null ? 0.85 : 1.0, 0)
  })

  return null
}

function buildCategoryLayout(items) {
  if (items.length === 1) {
    return {
      [items[0].id]: {
        modelPosition: [0, -0.4, 0.08],
        modelScale: 1.85,
        rotationY: 0.05,
      },
    }
  }

  if (items.length === 2) {
    return {
      [items[0].id]: {
        modelPosition: [-2.9, -0.56, -0.12],
        modelScale: 1.18,
        rotationY: 0.16,
      },
      [items[1].id]: {
        modelPosition: [2.9, -0.56, -0.12],
        modelScale: 1.18,
        rotationY: -0.16,
      },
    }
  }

  if (items.length === 3) {
    return {
      [items[0].id]: {
        modelPosition: [-3.8, -0.58, -0.45],
        modelScale: 1.05,
        rotationY: 0.16,
      },
      [items[1].id]: {
        modelPosition: [0, -0.5, -0.75],
        modelScale: 1.05,
        rotationY: 0,
      },
      [items[2].id]: {
        modelPosition: [3.8, -0.58, -0.45],
        modelScale: 1.05,
        rotationY: -0.16,
      },
    }
  }

  const map = {}
  const spacing = 3.8
  const startX = -((items.length - 1) * spacing) / 2

  items.forEach((item, index) => {
    map[item.id] = {
      modelPosition: [startX + index * spacing, -0.55, -0.2],
      modelScale: 1.1,
      rotationY: 0,
    }
  })

  return map
}

function Scene({
  category,
  categoryIndex,
  activeId,
  setActiveId,
  transitionPhase,
  language,
}) {
  const layout = useMemo(() => buildCategoryLayout(category.items), [category.items])
  const sceneRootRef = useRef()
  const activeSpotRef = useRef()
  const activeSpotTargetRef = useRef()

  const activeSlotX = activeId !== null ? layout[activeId]?.modelPosition?.[0] ?? null : null

  useEffect(() => {
    if (activeSpotRef.current && activeSpotTargetRef.current) {
      activeSpotRef.current.target = activeSpotTargetRef.current
    }
  }, [])

  useFrame(() => {
    if (!sceneRootRef.current) return

    const xTarget =
      transitionPhase === 'out' ? -1.2 : transitionPhase === 'in' ? 0.35 : 0

    sceneRootRef.current.position.x = THREE.MathUtils.lerp(
      sceneRootRef.current.position.x,
      xTarget,
      0.08
    )
  })

  return (
    <group ref={sceneRootRef}>
      <fog attach="fog" args={['#4a352d', 18, 42]} />

<ambientLight intensity={1.75} />
<hemisphereLight args={['#fbe2b8', '#5a3528', 1.9]} />

<directionalLight
  position={[6, 9, 7]}
  intensity={2.1}
  castShadow
  shadow-mapSize-width={1024}
  shadow-mapSize-height={1024}
/>

<spotLight
  position={[0, 8, 4.2]}
  intensity={3.4}
  angle={0.5}
  penumbra={0.95}
  distance={30}
  decay={1.35}
  color="#ffe8bd"
/>

<spotLight
  ref={activeSpotRef}
  position={[0, 6.4, 3.6]}
  intensity={activeId !== null ? 4.0 : 1.6}
  angle={0.34}
  penumbra={1}
  distance={22}
  decay={1.45}
  color="#fff6e3"
  castShadow
/>

<object3D ref={activeSpotTargetRef} position={[0, 0.72, 0]} />

<pointLight position={[-6, 4.2, 1.5]} intensity={1.1} color="#b18cff" />
<pointLight position={[6, 4.2, 1.5]} intensity={1.25} color="#f0b35d" />
<pointLight position={[0, 4.4, -1.5]} intensity={1.4} color="#ffd27d" />

<pointLight position={[-3.5, 1.4, 2.4]} intensity={0.7} color="#ffcf8a" />
<pointLight position={[3.5, 1.4, 2.4]} intensity={0.7} color="#ffcf8a" />

      <SceneDecor />
      <FloatingDust />

      {category.items.map((item, index) => {
        const slot = layout[item.id]
        return (
          <MuseumItem
            key={item.id}
            item={item}
            index={index}
            activeId={activeId}
            setActiveId={setActiveId}
            slot={slot}
            total={category.items.length}
            activeSlotX={activeSlotX}
            audioSrc={EXHIBIT_AUDIO_SOURCES[language]?.[item.id]}
          />
        )
      })}

      <CameraRig
        activeId={activeId}
        categoryIndex={categoryIndex}
        transitionPhase={transitionPhase}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.02}
      />
    </group>
  )
}

export default function App() {
  const [language, setLanguage] = useState('ru')
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState('idle')
  const [panelVisible, setPanelVisible] = useState(true)
  const [translatedEyebrowByLang, setTranslatedEyebrowByLang] = useState({})
  const audioRef = useRef(null)
  const transitionLockRef = useRef(false)

  const dictionary = I18N[language]
  const activeCategory = dictionary.categories[categoryIndex]
  const activeItem = activeCategory.items.find((i) => i.id === activeId) || null

  useEffect(() => {
    setActiveId(null)
  }, [categoryIndex, language])

  const handleLanguageChange = async (nextLanguage) => {
    setLanguage(nextLanguage)
    setActiveId(null)

    if (nextLanguage === 'kk') return
    if (translatedEyebrowByLang[nextLanguage]) return

    try {
      const translated = await translateText(
        I18N.kk.ui.eyebrow,
        'kk',
        nextLanguage
      )

      setTranslatedEyebrowByLang((prev) => ({
        ...prev,
        [nextLanguage]: translated || dictionary.ui.eyebrow,
      }))
    } catch (e) {
      console.error('Translation failed', e)
    }
  }

  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioRef.current) return
      try {
        audioRef.current.volume = 0.03
        await audioRef.current.play()
        setAudioEnabled(true)
      } catch (error) {
        console.log('Audio autoplay blocked:', error)
      }
    }

    const handleFirstInteraction = () => {
      unlockAudio()
      window.removeEventListener('click', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction)
    return () => window.removeEventListener('click', handleFirstInteraction)
  }, [])

  const toggleAudio = async () => {
    if (!audioRef.current) return

    if (audioEnabled) {
      audioRef.current.pause()
      setAudioEnabled(false)
    } else {
      try {
        audioRef.current.volume = 0.03
        await audioRef.current.play()
        setAudioEnabled(true)
      } catch (error) {
        console.log('Cannot play audio:', error)
      }
    }
  }

  const changeCategorySmooth = (nextIndex) => {
    if (transitionLockRef.current) return
    transitionLockRef.current = true

    setPanelVisible(false)
    setActiveId(null)
    setTransitionPhase('out')

    setTimeout(() => {
      setCategoryIndex(nextIndex)
      setTransitionPhase('in')
    }, 260)

    setTimeout(() => {
      setPanelVisible(true)
    }, 340)

    setTimeout(() => {
      setTransitionPhase('idle')
      transitionLockRef.current = false
    }, 760)
  }

  const goPrev = () => {
    changeCategorySmooth(
      (categoryIndex - 1 + dictionary.categories.length) %
        dictionary.categories.length
    )
  }

  const goNext = () => {
    changeCategorySmooth((categoryIndex + 1) % dictionary.categories.length)
  }

  const infoCardClass = [
    'infoPanel',
    activeItem && panelVisible ? 'show' : '',
    activeCategory.items.length === 1
      ? 'right'
      : activeItem?.id === activeCategory.items[0]?.id
      ? 'right'
      : 'left',
  ].join(' ')

  const topBarClass = ['topBar', panelVisible ? 'show' : 'hide'].join(' ')

  return (
    <div className="appShell">
      <div className="bgAura bgAuraLeft" />
      <div className="bgAura bgAuraRight" />
      <div className="topFade" />
      <div className="bottomFade" />

      <audio ref={audioRef} loop preload="auto">
        <source src="/kui2.mp3" type="audio/mpeg" />
      </audio>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.1, 13.8], fov: 39 }}
        onPointerMissed={() => setActiveId(null)}
      >
        <Suspense fallback={null}>
          <Scene
            category={activeCategory}
            categoryIndex={categoryIndex}
            activeId={activeId}
            setActiveId={setActiveId}
            transitionPhase={transitionPhase}
            language={language}
          />
        </Suspense>
      </Canvas>

      <div className="languageSwitcher">
        <button
          className={language === 'kk' ? 'active' : ''}
          onClick={() => handleLanguageChange('kk')}
        >
          Қазақша
        </button>
        <button
          className={language === 'ru' ? 'active' : ''}
          onClick={() => handleLanguageChange('ru')}
        >
          Русский
        </button>
      </div>

      <div className={topBarClass}>
        <div className="topBarEyebrow">
          {translatedEyebrowByLang[language] || dictionary.ui.eyebrow}
        </div>
        <div className="topBarTitle">{activeCategory.title}</div>
        <div className="topBarSubtitle">{activeCategory.subtitle}</div>
      </div>

      <button
        className="sideArrow sideArrowLeft"
        onClick={goPrev}
        aria-label={dictionary.ui.prevHall}
      >
        <span>‹</span>
      </button>

      <button
        className="sideArrow sideArrowRight"
        onClick={goNext}
        aria-label={dictionary.ui.nextHall}
      >
        <span>›</span>
      </button>

      <div className={infoCardClass}>
        {activeItem && (
          <>
            <div className="infoPanelCategory">
              {dictionary.ui.artifactDescription}
            </div>
            <div className="infoPanelTitle">{activeItem.title}</div>
            <div className="infoPanelText">{activeItem.description}</div>
          </>
        )}
      </div>

      <button
        className={`soundButton overlaySound ${audioEnabled ? 'active' : ''}`}
        onClick={toggleAudio}
      >
        {audioEnabled ? dictionary.ui.soundOn : dictionary.ui.soundOff}
      </button>

      <div className="universityFooter">
        <img src="/logo.png" alt="AOGU" className="universityFooterLogo" />
        <div className="universityFooterText">
          ATYRAU OIL AND GAS UNIVERSITY
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Screen = 'validation' | 'version' | 'wheel' | 'grid' | 'question' | 'form' | 'confirmation'

const PRIZES = [
  { name: 'Balón Trionda México', image: '/Balon trionda Mexico.png' },
  { name: 'Balón Trionda', image: '/Balón Trionda.png' },
  { name: 'Bolsa de tela Gillette', image: '/Bolsa de tela Gillette.png' },
  { name: 'Caja PANINI', image: '/Caja PANINI.webp' },
  { name: 'Gorra Gillette', image: '/Gorra Gillette.png' },
  { name: 'Taza Gillette', image: '/Tasa Gillette.png' },
  { name: 'Gorra Selección Mexicana', image: '/Gorra Selección Mexicana.webp' },
  { name: 'Hielera Gillette', image: '/Hielera Gillette.webp' },
  { name: 'Mini Balón Trionda', image: '/Mini Balón Trionda.webp' },
  { name: 'Mochila selección mexicana', image: '/Mochila selección mexicana.png' },
  { name: 'Playera Copa Mundial FIFA', image: '/Playera Copa Mundial FIFA.png' },
  { name: 'Playera Selección Mexicana', image: '/Playera Selección Mexicana.png' },
  { name: 'Sudadera Mundial', image: '/Sudadera Mundial.webp' },
  { name: 'Sudadera selección mexicana', image: '/Sudadera selección mexicana.png' },
  { name: 'Termo Gillette', image: '/Termo Gillette.png' },
  { name: 'T-Shirt Gillette', image: '/T-Shirt Gillette.webp' }
]

const GRID_PRIZES = [
  { name: 'Balón Trionda México', image: '/Balon trionda Mexico.png' },
  { name: 'Balón Trionda', image: '/Balón Trionda.png' },
  { name: 'Bolsa de tela Gillette', image: '/Bolsa de tela Gillette.png' },
  { name: 'Caja PANINI', image: '/Caja PANINI.webp' },
  { name: 'Gorra Gillette', image: '/Gorra Gillette.png' },
  { name: 'Taza Gillette', image: '/Tasa Gillette.png' },
  { name: 'Gorra Selección Mexicana', image: '/Gorra Selección Mexicana.webp' },
  { name: 'Hielera Gillette', image: '/Hielera Gillette.webp' },
  { name: 'Mini Balón Trionda', image: '/Mini Balón Trionda.webp' },
  { name: 'Mochila selección mexicana', image: '/Mochila selección mexicana.png' },
  { name: 'Playera Copa Mundial FIFA', image: '/Playera Copa Mundial FIFA.png' },
  { name: 'Playera Selección Mexicana', image: '/Playera Selección Mexicana.png' },
  { name: 'Sudadera Mundial', image: '/Sudadera Mundial.webp' },
  { name: 'Sudadera selección mexicana', image: '/Sudadera selección mexicana.png' },
  { name: 'Termo Gillette', image: '/Termo Gillette.png' },
  { name: 'T-Shirt Gillette', image: '/T-Shirt Gillette.webp' }
]

const DARK_BLUE = '#0a2540'
const WHEEL_COLOR_1 = '#003981'
const WHEEL_COLOR_2 = '#0069d2'

const QUESTION_OPTIONS = [
  { id: 'a', text: '1 vez más' },
  { id: 'b', text: '2 veces más' }
]

export default function WheelOfFortune() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('validation')
  const [selectedVersion, setSelectedVersion] = useState<1 | 2>(1)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState('')
  const [selectedPrizeImage, setSelectedPrizeImage] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [formData, setFormData] = useState({
    courseNumber: '',
    fullName: '',
    address: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGridPrize, setSelectedGridPrize] = useState<number | null>(null)
  const [isGridRevealing, setIsGridRevealing] = useState(false)
  const [isGridSpinning, setIsGridSpinning] = useState(false)
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState<number | null>(null)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const wheelRef = useRef<HTMLDivElement>(null)
  const gridIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleValidate = () => {
    setCurrentScreen('version')
  }

  const handleVersion1 = () => {
    setSelectedVersion(1)
    setCurrentScreen('wheel')
  }

  const handleVersion2 = () => {
    setSelectedVersion(2)
    setCurrentScreen('grid')
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const randomDegree = Math.floor(Math.random() * 360) + 1800 // At least 5 full rotations
    const newRotation = wheelRotation + randomDegree
    setWheelRotation(newRotation)

    // Calculate which prize was selected
    setTimeout(() => {
      const normalizedRotation = newRotation % 360
      const segmentAngle = 360 / 16
      const winningIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % 16
      setSelectedPrize(PRIZES[winningIndex].name)
      setSelectedPrizeImage(PRIZES[winningIndex].image)

      setIsSpinning(false)
      setTimeout(() => {
        setCurrentScreen('question')
      }, 500)
    }, 5000) // 5 seconds for the spin animation
  }

  const handleGridPlay = () => {
    if (isGridSpinning) return

    setShowPlayButton(false)
    setIsGridSpinning(true)
    setCurrentHighlightIndex(null)
    setSelectedGridPrize(null)

    // Start the random highlighting animation
    let currentIndex = 0
    const totalDuration = 5000 // 5 seconds
    const intervalTime = 200 // Change every 200ms (slower)
    const totalIterations = totalDuration / intervalTime

    gridIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % 16
      setCurrentHighlightIndex(currentIndex)
    }, intervalTime)

    // After 5 seconds, stop and select the winner
    setTimeout(() => {
      if (gridIntervalRef.current) {
        clearInterval(gridIntervalRef.current)
        gridIntervalRef.current = null
      }

      const winningIndex = Math.floor(Math.random() * 16)
      setCurrentHighlightIndex(winningIndex)
      setSelectedGridPrize(winningIndex)
      setSelectedPrize(GRID_PRIZES[winningIndex].name)
      setSelectedPrizeImage(GRID_PRIZES[winningIndex].image)
      setIsGridSpinning(false)

      setTimeout(() => {
        setCurrentScreen('question')
      }, 500)
    }, totalDuration)
  }

  const handleGridPrizeClick = (index: number) => {
    // Disabled for this version - only play button works
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === 'b') {
      setAnswerError('')
      setCurrentScreen('form')
    } else {
      setAnswerError('Has contestado incorrectamente, pero vuelve a intentarlo.')
    }
  }

  const handleFormSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setCurrentScreen('confirmation')
    }, 1500)
  }

  const handleRestart = () => {
    if (gridIntervalRef.current) {
      clearInterval(gridIntervalRef.current)
      gridIntervalRef.current = null
    }
    setCurrentScreen('validation')
    setSelectedVersion(1)
    setWheelRotation(0)
    setSelectedPrize('')
    setSelectedPrizeImage('')
    setSelectedAnswer('')
    setAnswerError('')
    setFormData({ courseNumber: '', fullName: '', address: '' })
    setIsLoading(false)
    setSelectedGridPrize(null)
    setIsGridRevealing(false)
    setIsGridSpinning(false)
    setCurrentHighlightIndex(null)
    setShowPlayButton(true)
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-center bg-no-repeat bg-fixed responsive-bg"
      style={{ backgroundColor: '#f0f4f8', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Screen 1: Validation Modal */}
          <AnimatePresence mode="wait">
            {currentScreen === 'validation' && (
              <motion.div
                key="validation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-[#0056b3]"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffb703] to-[#e63946] rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 1v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0056b3] mb-4">
                    ¡Bienvenido a la Ruleta de la Suerte!
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Para jugar debes tener <span className="font-bold text-[#e63946]">25 puntos PG</span>
                  </p>
                  <button
                    onClick={handleValidate}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#0056b3] to-[#004494] text-white font-bold text-lg rounded-xl hover:from-[#004494] hover:to-[#003373] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Validar y Jugar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 2: Version Selection */}
          <AnimatePresence mode="wait">
            {currentScreen === 'version' && (
              <motion.div
                key="version"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-[#0056b3]"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffb703] to-[#e63946] rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0056b3] mb-4">
                    Selecciona una Versión
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Elige la versión de la ruleta que deseas jugar
                  </p>
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVersion1}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#0056b3] to-[#004494] text-white font-bold text-lg rounded-xl hover:from-[#004494] hover:to-[#003373] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Ruleta Versión 1
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVersion2}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white font-bold text-lg rounded-xl hover:from-[#c1121f] hover:to-[#a10e1a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Ruleta Versión 2
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 3: Wheel */}
          <AnimatePresence mode="wait">
            {currentScreen === 'wheel' && (
              <motion.div
                key="wheel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-[#0056b3] mb-8"
                >
                  ¡Gira y Gana!
                </motion.h1>

                <div className="relative flex justify-center items-center mb-8">
                  {/* Static Arrow - positioned above the wheel, doesn't rotate */}
                  <div
                    className="absolute z-20"
                    style={{
                      left: '50%',
                      top: '0px',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#FFFFFF] drop-shadow-lg"></div>
                  </div>
                  
                  {/* Wheel */}
                  <motion.div
                    ref={wheelRef}
                    animate={{ rotate: wheelRotation }}
                    transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative w-[450px] h-[450px] md:w-[550px] md:h-[550px]"
                    style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
                  >
                    {/* Wheel segments */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {PRIZES.map((prize, index) => {
                        const segmentAngle = 360 / 16
                        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
                        const endAngle = (((index + 1) * segmentAngle) - 90) * (Math.PI / 180)
                        const x1 = 50 + 50 * Math.cos(startAngle)
                        const y1 = 50 + 50 * Math.sin(startAngle)
                        const x2 = 50 + 50 * Math.cos(endAngle)
                        const y2 = 50 + 50 * Math.sin(endAngle)
                        const midAngle = (startAngle + endAngle) / 2

                        return (
                          <g key={index}>
                            {/* Segment background */}
                            <path
                              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                              fill={index % 2 === 0 ? WHEEL_COLOR_1 : WHEEL_COLOR_2}
                              stroke="#fff"
                              strokeWidth="0.3"
                            />
                            {/* Prize text - centered and aligned */}
                            <text
                              fill="white"
                              fontSize="3"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              x={50 + 28 * Math.cos(midAngle)}
                              y={50 + 28 * Math.sin(midAngle)}
                              transform={`rotate(${midAngle * 180 / Math.PI}, ${50 + 28 * Math.cos(midAngle)}, ${50 + 28 * Math.sin(midAngle)})`}
                            >
                              {prize.name.length > 17 ? prize.name.substring(0, 16) + '..' : prize.name}
                            </text>
                          </g>
                        )
                      })}
                    </svg>

                    {/* Center circle */}
                    <img
                      src="/RuletteCenter.png"
                      alt="Ruleta Center"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full shadow-lg object-cover z-10"
                    />
                  </motion.div>
                </div>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="mt-[30px] md:mt-8 px-8 py-4 bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                    isSpinning ? 'opacity-50 cursor-not-allowed' : ''
                  }"
                >
                  {isSpinning ? 'Girando...' : 'GIRAR'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 3: Grid Version 2 */}
          <AnimatePresence mode="wait">
            {currentScreen === 'grid' && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-[#0056b3] mb-8"
                >
                  ¡Selecciona y Gana!
                </motion.h1>

                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                  {GRID_PRIZES.map((prize, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        ...(currentHighlightIndex === index && !isGridSpinning && selectedGridPrize === index ? { scale: 1.05 } : {})
                      }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative aspect-square rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 ${
                        currentHighlightIndex === index && !showPlayButton
                          ? 'ring-[10px] ring-[#dc2626] scale-120 z-10'
                          : ''
                      } ${isGridSpinning && currentHighlightIndex !== index ? 'grayscale' : ''} ${
                        isGridSpinning && currentHighlightIndex === index ? '' : ''
                      } ${selectedGridPrize === index ? 'ring-[10px] ring-[#dc2626] scale-120 z-10' : ''}`}
                    >
                      <img
                        src={prize.image}
                        alt={prize.name}
                        className={`w-full h-full object-cover ${
                          isGridSpinning && currentHighlightIndex !== index ? 'grayscale' : ''
                        }`}
                      />
                      {selectedGridPrize === index && !isGridSpinning && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center"
                        >
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Play Button - Centered */}
                {showPlayButton && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleGridPlay}
                    disabled={isGridSpinning}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-12 py-6 bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 ${
                      isGridSpinning ? 'opacity-50 cursor-not-allowed' : ''
                    }"
                  >
                    {isGridSpinning ? 'Girando...' : 'JUGAR'}
                  </motion.button>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 4: Security Question Modal */}
          <AnimatePresence mode="wait">
            {currentScreen === 'question' && (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-[#ffb703]"
                >
                  <h2 className="text-2xl font-bold text-[#0056b3] mb-4">
                    ¡Felicidades!
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    Has ganado:
                  </p>
                  <p className="text-2xl font-bold text-[#e63946] mb-6">
                    {selectedPrize}
                  </p>
                  
                  {/* Prize Image */}
                  {selectedPrizeImage && (
                    <motion.img
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      src={selectedPrizeImage}
                      alt={selectedPrize}
                      className="w-32 h-32 mx-auto rounded-xl shadow-lg object-cover mb-6"
                    />
                  )}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-700 font-semibold mb-2">
                      Para obtener tu premio debes contestar la siguiente pregunta
                    </p>
                    <p className="text-gray-600 text-sm mb-4 font-bold">
                      Mach 3 dura ___ veces más?
                    </p>
                    <div className="space-y-3">
                      {QUESTION_OPTIONS.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedAnswer(option.id)
                            setAnswerError('')
                          }}
                          className={`w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 font-semibold ${
                            selectedAnswer === option.id
                              ? 'border-[#0056b3] bg-[#0056b3] text-white shadow-lg'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-[#0056b3] hover:bg-blue-50'
                          }`}
                        >
                          <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
                          {option.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {answerError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mb-4"
                    >
                      {answerError}
                    </motion.p>
                  )}
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-[#0056b3] to-[#004494] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      !selectedAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#004494] hover:to-[#003373]'
                    }`}
                  >
                    Responder
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 4: Data Form */}
          <AnimatePresence mode="wait">
            {currentScreen === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto"
              >
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-[#0056b3]"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ffb703] to-[#e63946] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0056b3]">
                      ¡Perfecto!
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Completa tus datos para enviar el premio
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Número de curso
                      </label>
                      <input
                        type="text"
                        value={formData.courseNumber}
                        onChange={(e) => setFormData({ ...formData, courseNumber: e.target.value })}
                        placeholder="Ej: CUR-12345"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0056b3] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0056b3] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Dirección
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Ej: Av. Principal #123, Ciudad"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0056b3] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      onClick={handleFormSubmit}
                      disabled={isLoading || !formData.courseNumber || !formData.fullName || !formData.address}
                      className={`w-full py-4 px-6 bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                        isLoading || !formData.courseNumber || !formData.fullName || !formData.address
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:from-[#c1121f] hover:to-[#a10e1a]'
                      }`}
                    >
                      {isLoading ? 'Enviando...' : 'ENVIAR'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen 5: Confirmation */}
          <AnimatePresence mode="wait">
            {currentScreen === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-4 border-[#0056b3]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#0056b3] to-[#004494] rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-[#0056b3] mb-4">
                    ¡Enviado con éxito!
                  </h2>

                  <p className="text-gray-600 mb-6">
                    Hemos enviado la confirmación de tu premio al correo electrónico. Te contactaremos para coordinar la entrega.
                  </p>

                  <p className="text-[#ffb703] font-bold text-lg mb-6">
                    Gracias por participar
                  </p>

                  <button
                    onClick={handleRestart}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#0056b3] to-[#004494] text-white font-bold text-lg rounded-xl hover:from-[#004494] hover:to-[#003373] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Reiniciar Demo
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto py-4 px-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Ruleta de la Suerte. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .responsive-bg {
          background-image: url('/Background_Desktop.webp');
        }

        @media (max-width: 768px) {
          .responsive-bg {
            background-image: url('/Background_Mobile.webp');
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .responsive-bg {
            background-image: url('/Background_Tablet.webp');
          }
        }

        @media (min-width: 1025px) {
          .responsive-bg {
            background-image: url('/Background_Desktop.webp');
          }
        }
      `}</style>
    </div>
  )
}

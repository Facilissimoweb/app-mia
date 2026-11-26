import { Component, lazy, Suspense, useEffect, useState } from 'react'

const AmbientMeshCanvas = lazy(() => import('./AmbientMeshCanvas.jsx'))

class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('La scena 3D ambientale non è disponibile.', error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export default function AmbientMesh3D() {
  const [isSmallScreen, setIsSmallScreen] = useState(true)

  useEffect(() => {
    const smallScreenQuery = window.matchMedia('(max-width: 767px)')
    const updateScreenSize = () => setIsSmallScreen(smallScreenQuery.matches)

    updateScreenSize()
    smallScreenQuery.addEventListener('change', updateScreenSize)
    return () => smallScreenQuery.removeEventListener('change', updateScreenSize)
  }, [])

  if (isSmallScreen) return null

  return (
    <SceneErrorBoundary>
      <Suspense fallback={null}>
        <AmbientMeshCanvas />
      </Suspense>
    </SceneErrorBoundary>
  )
}

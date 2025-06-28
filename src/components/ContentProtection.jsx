import { useEffect } from 'react'

const ContentProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault()
      return false
    }

    // Disable drag and drop
    const handleDragStart = (e) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts for copying, saving, etc.
    const handleKeyDown = (e) => {
      // Disable Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+A (Select All)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+V (Paste)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+X (Cut)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
      
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }
    }

    // Disable image dragging
    const handleImageDrag = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault()
        return false
      }
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleImageDrag)

    // Disable text selection via CSS
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.mozUserSelect = 'none'
    document.body.style.msUserSelect = 'none'

    // Disable image dragging via CSS
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      img.style.pointerEvents = 'none'
      img.style.userSelect = 'none'
      img.draggable = false
    })

    // Add CSS to prevent highlighting
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Allow selection for input fields and buttons */
      input, textarea, button, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }
      
      /* Disable print styles */
      @media print {
        body { display: none !important; }
      }
    `
    document.head.appendChild(style)

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleImageDrag)
      
      // Reset styles
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.mozUserSelect = ''
      document.body.style.msUserSelect = ''
      
      // Remove the style element
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  // Additional protection: Monitor for developer tools
  useEffect(() => {
    let devtools = {
      open: false,
      orientation: null
    }

    const threshold = 160

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true
          console.clear()
          console.log('%cContent is protected!', 'color: red; font-size: 20px; font-weight: bold;')
        }
      } else {
        devtools.open = false
      }
    }, 500)

    // Disable console
    if (typeof console !== 'undefined') {
      console.log = () => {}
      console.warn = () => {}
      console.error = () => {}
      console.info = () => {}
      console.debug = () => {}
      console.clear = () => {}
    }
  }, [])

  return null // This component doesn't render anything
}

export default ContentProtection


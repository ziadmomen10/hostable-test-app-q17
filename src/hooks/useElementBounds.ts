/**
 * useElementBounds
 * 
 * Hook to track the bounding rectangle of a DOM element.
 * Updates on scroll, resize, and mutation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ElementBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export function useElementBounds(
  selector: string | null
): ElementBounds | null {
  const [bounds, setBounds] = useState<ElementBounds | null>(null);
  const rafRef = useRef<number | null>(null);
  
  const updateBounds = useCallback(() => {
    if (!selector) {
      setBounds(null);
      return;
    }
    
    const element = document.querySelector(selector);
    if (!element) {
      setBounds(null);
      return;
    }
    
    const rect = element.getBoundingClientRect();
    setBounds({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  }, [selector]);
  
  useEffect(() => {
    updateBounds();
    
    // Use RAF for smooth updates
    const rafUpdate = () => {
      updateBounds();
      rafRef.current = requestAnimationFrame(rafUpdate);
    };
    rafRef.current = requestAnimationFrame(rafUpdate);
    
    // Also listen to scroll and resize
    window.addEventListener('scroll', updateBounds, true);
    window.addEventListener('resize', updateBounds);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', updateBounds, true);
      window.removeEventListener('resize', updateBounds);
    };
  }, [updateBounds]);
  
  return bounds;
}

/**
 * Hook to track bounds of an element by ref
 */
export function useElementBoundsRef<T extends HTMLElement>(): [
  React.RefObject<T>,
  ElementBounds | null
] {
  const ref = useRef<T>(null);
  const [bounds, setBounds] = useState<ElementBounds | null>(null);
  
  useEffect(() => {
    const updateBounds = () => {
      if (!ref.current) {
        setBounds(null);
        return;
      }
      
      const rect = ref.current.getBoundingClientRect();
      setBounds({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    };
    
    updateBounds();
    
    // Use ResizeObserver for element size changes
    const resizeObserver = new ResizeObserver(updateBounds);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    // Also listen to scroll and resize
    window.addEventListener('scroll', updateBounds, true);
    window.addEventListener('resize', updateBounds);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateBounds, true);
      window.removeEventListener('resize', updateBounds);
    };
  }, []);
  
  return [ref, bounds];
}

export default useElementBounds;

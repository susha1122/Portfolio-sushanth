/**
 * Lightweight SplitText replacement for GSAP premium plugin.
 * Splits text content into individual chars, words, and/or lines
 * wrapped in <div> elements for animation purposes.
 * Handles <br>, <span>, and other inline HTML correctly.
 */

interface SplitTextOptions {
  type?: string;
  linesClass?: string;
}

export class SplitText {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  private elements: HTMLElement[];
  private originals: Map<HTMLElement, string> = new Map();

  constructor(
    target: string | HTMLElement | HTMLElement[] | (string | HTMLElement)[],
    options: SplitTextOptions = {}
  ) {
    // Resolve target elements
    if (typeof target === "string") {
      this.elements = Array.from(
        document.querySelectorAll<HTMLElement>(target)
      );
    } else if (Array.isArray(target)) {
      this.elements = target.flatMap((t) =>
        typeof t === "string"
          ? Array.from(document.querySelectorAll<HTMLElement>(t))
          : [t]
      );
    } else {
      this.elements = [target];
    }

    const types = (options.type || "chars").split(",").map((t) => t.trim());
    const splitChars = types.includes("chars");
    const splitLines = types.includes("lines");
    const linesClass = options.linesClass || "";

    this.elements.forEach((el) => {
      this.originals.set(el, el.innerHTML);

      // Extract text segments, preserving <br> as line breaks
      const textSegments = this.getTextSegments(el);
      el.innerHTML = "";

      const wordEls: HTMLElement[] = [];
      const charEls: HTMLElement[] = [];

      textSegments.forEach((segment, segIndex) => {
        if (segment === "\n") {
          // Insert a line break
          el.appendChild(document.createElement("br"));
          return;
        }

        const segWords = segment.split(/\s+/).filter((w) => w.length > 0);

        segWords.forEach((word, wordIndex) => {
          const wordSpan = document.createElement("div");
          wordSpan.style.display = "inline-block";
          wordSpan.style.position = "relative";

          if (splitChars) {
            word.split("").forEach((char) => {
              const charSpan = document.createElement("div");
              charSpan.style.display = "inline-block";
              charSpan.style.position = "relative";
              charSpan.textContent = char;
              wordSpan.appendChild(charSpan);
              charEls.push(charSpan);
            });
          } else {
            wordSpan.textContent = word;
          }

          el.appendChild(wordSpan);
          wordEls.push(wordSpan);

          // Add space between words (not after last word of segment, not before line break)
          const isLastWordInSegment = wordIndex === segWords.length - 1;
          const nextSegmentIsBreak =
            segIndex < textSegments.length - 1 &&
            textSegments[segIndex + 1] === "\n";

          if (!isLastWordInSegment) {
            el.appendChild(document.createTextNode("\u00A0"));
          } else if (
            isLastWordInSegment &&
            !nextSegmentIsBreak &&
            segIndex < textSegments.length - 1
          ) {
            el.appendChild(document.createTextNode("\u00A0"));
          }
        });
      });

      // Wrap in lines if needed
      if (splitLines && linesClass) {
        this.wrapInLines(el, wordEls, linesClass);
      }

      this.words.push(...wordEls);
      this.chars.push(...charEls);
    });
  }

  private getTextSegments(el: HTMLElement): string[] {
    const segments: string[] = [];
    const childNodes = el.childNodes;

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          segments.push(text);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === "BR") {
          segments.push("\n");
        } else {
          // For <span>, <div>, etc., extract their text content
          const innerText = element.textContent?.trim();
          if (innerText) {
            segments.push(innerText);
          }
        }
      }
    });

    return segments;
  }

  private wrapInLines(
    el: HTMLElement,
    wordEls: HTMLElement[],
    linesClass: string
  ) {
    if (wordEls.length === 0) return;

    // Group elements by their vertical position into lines
    const lineGroups: HTMLElement[][] = [];
    let currentLine: HTMLElement[] = [];
    let lastTop = -1;

    wordEls.forEach((wordEl) => {
      const rect = wordEl.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (lastTop === -1 || Math.abs(top - lastTop) < 5) {
        currentLine.push(wordEl);
      } else {
        if (currentLine.length > 0) lineGroups.push([...currentLine]);
        currentLine = [wordEl];
      }
      lastTop = top;
    });
    if (currentLine.length > 0) lineGroups.push([...currentLine]);

    // Clear and rebuild with line wrappers
    el.innerHTML = "";
    lineGroups.forEach((lineWords) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = linesClass;
      lineDiv.style.overflow = "hidden";
      lineWords.forEach((wordEl, i) => {
        lineDiv.appendChild(wordEl);
        if (i < lineWords.length - 1) {
          lineDiv.appendChild(document.createTextNode("\u00A0"));
        }
      });
      el.appendChild(lineDiv);
      this.lines.push(lineDiv);
    });
  }

  revert() {
    this.elements.forEach((el) => {
      const original = this.originals.get(el);
      if (original !== undefined) {
        el.innerHTML = original;
      }
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}

import { useState, useEffect } from 'react';
import ResizableSplit from './ResizableSplit';

const QuadrantGrid = ({ renderQuadrant }) => {
  const [expandedQuadrant, setExpandedQuadrant] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // 手機版 3層 split 狀態
  const [s1, setS1] = useState([0.25, 0.75]);
  const [s2, setS2] = useState([0.33, 0.67]);
  const [s3, setS3] = useState([0.5, 0.5]);

  const [c1, setC1] = useState(null);
  const [c2, setC2] = useState(null);
  const [c3, setC3] = useState(null);

  // 電腦版 split 狀態
  const [verticalSplit, setVerticalSplit] = useState([0.5, 0.5]);
  const [topSplit, setTopSplit] = useState([0.5, 0.5]);
  const [bottomSplit, setBottomSplit] = useState([0.5, 0.5]);

  const [vc, setVC] = useState(null);
  const [tc, setTC] = useState(null);
  const [bc, setBC] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDoubleClick = (id) => {
    setExpandedQuadrant((prev) => (prev === id ? null : id));
  };

  const getQuadrantComponent = (id) => (
    <div
      onDoubleClick={(e) => {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        if (e.target.closest('.no-expand')) return;
        handleDoubleClick(id);
      }}
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'manipulation',
      }}
    >
      {renderQuadrant(id)}
    </div>
  );

  if (expandedQuadrant) {
    return (
      <div style={{ width: '100%', height: '100%' }}>{getQuadrantComponent(expandedQuadrant)}</div>
    );
  }

  if (isMobile) {
    return (
      <ResizableSplit
        direction="horizontal"
        sizes={s1}
        setSizes={setS1}
        collapsedIndex={c1}
        setCollapsedIndex={setC1}
      >
        {getQuadrantComponent('IU')}
        <ResizableSplit
          direction="horizontal"
          sizes={s2}
          setSizes={setS2}
          collapsedIndex={c2}
          setCollapsedIndex={setC2}
        >
          {getQuadrantComponent('IN')}
          <ResizableSplit
            direction="horizontal"
            sizes={s3}
            setSizes={setS3}
            collapsedIndex={c3}
            setCollapsedIndex={setC3}
          >
            {getQuadrantComponent('NU')}
            {getQuadrantComponent('NN')}
          </ResizableSplit>
        </ResizableSplit>
      </ResizableSplit>
    );
  }

  return (
    <ResizableSplit
      direction="horizontal"
      sizes={verticalSplit}
      setSizes={setVerticalSplit}
      collapsedIndex={vc}
      setCollapsedIndex={setVC}
    >
      <ResizableSplit
        direction="vertical"
        sizes={topSplit}
        setSizes={setTopSplit}
        collapsedIndex={tc}
        setCollapsedIndex={setTC}
      >
        {getQuadrantComponent('IN')}
        {getQuadrantComponent('IU')}
      </ResizableSplit>
      <ResizableSplit
        direction="vertical"
        sizes={bottomSplit}
        setSizes={setBottomSplit}
        collapsedIndex={bc}
        setCollapsedIndex={setBC}
      >
        {getQuadrantComponent('NN')}
        {getQuadrantComponent('NU')}
      </ResizableSplit>
    </ResizableSplit>
  );
};

export default QuadrantGrid;

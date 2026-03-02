import React from "react";
import type { MapPoint, PageBase } from "./Types";


function MuseumMap( {mapData}: {mapData:PageBase}) {
  if(!mapData.mapPoints) return null;
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPoint, setSelectedPoint] = React. useState<MapPoint | null>(null);

  const openModal = (point:MapPoint) => {
    setSelectedPoint(point);
    setShowModal(true);
  };

  return (
    <section className="map-container">
      <img src={mapData.image} alt="План музея" />
      {mapData.mapPoints.map((point) => (
        <button
          key={point.id}
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          className="map-point"
          onClick={() => openModal(point)}
        ></button>
      ))}

      {showModal && selectedPoint && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPoint.title}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <img src={selectedPoint.image} alt={selectedPoint.title} />
            <p>{selectedPoint.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MuseumMap ;
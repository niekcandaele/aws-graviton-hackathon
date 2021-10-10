import { useEffect, useRef } from 'react';
import simpleheat from 'simpleheat';
import useImage from 'use-image';

import de_cache from '../../public/maps/de_cache.png';
import de_dust2 from '../../public/maps/de_dust2.png';
import de_inferno from '../../public/maps/de_inferno.png';
import de_mirage from '../../public/maps/de_mirage.png';
import de_nuke from '../../public/maps/de_nuke.png';
import de_overpass from '../../public/maps/de_overpass.png';
import de_train from '../../public/maps/de_train.png';
import de_vertigo from '../../public/maps/de_vertigo.png';

const mapImages = {
  "de_cache": de_cache,
  "de_dust2": de_dust2,
  "de_inferno": de_inferno,
  "de_mirage": de_mirage,
  "de_nuke": de_nuke,
  "de_overpass": de_overpass,
  "de_vertigo": de_vertigo,
  "de_train": de_train,
};

interface IHeatmapHandlerProps {
  canvas: string;
  data: Array<Array<number>>
  map: string
}

const csgo_maps : Record<string, Record<string, number>> = {
    "de_cache": {
      "pos_x": -2000,
      "pos_y": 3250,
      "scale": 5.5,
    },
    "de_cbble": {
      "pos_x": -3840, // upper left world x coordinate
      "pos_y": 3072, // upper left world y coordinate
      "scale": 6,
    },
    "de_inferno": {
      "pos_x": -2200, // upper left world x coordinate
      "pos_y": 4800, // upper left world y coordinate
      "scale": 5.9,
    },
    "de_mirage": {
      "pos_x": -3230,
      "pos_y": 1713,
      "scale": 5.00,
    },
    "de_nuke": {
      "pos_x": -3453,
      "pos_y": 2887,
      "scale": 7.00,
    },
    "de_overpass": {
      "pos_x": -4831,
      "pos_y": 1781,
      "scale": 5.2,
    },
    "de_train": {
      "pos_x": -2477,
      "pos_y": 2392,
      "scale": 4.7,
    },
    "de_vertigo": {
      "pos_x": -3777,
      "pos_y": 2092,
      "scale": 4.7,
    },
};

function translateCoordinates(x_game: number, y_game: number, map: string) {
  const pos_x = csgo_maps[map].pos_x;
  const pos_y = csgo_maps[map].pos_y;
  const scale_factor = csgo_maps[map].scale * 2;

  const x_prime = (x_game - pos_x) / scale_factor;
  const y_prime = (pos_y - y_game) / scale_factor;

  return {"x": x_prime, "y": y_prime};
};

export default function HeatmapHandler(props: IHeatmapHandlerProps) {
  if (!(props.map in csgo_maps)) {
    return null
  }


  const heatmapRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const canvas = mapRef.current;
    if (canvas) {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      const updatedData = props.data.map(orig => {
        const {x, y} = translateCoordinates(orig[0], orig[1], props.map);
        return [x, y, 0.5];
      });
      const image = new Image();
      image.src = mapImages[props.map];
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        const heat = simpleheat(canvas);
        heat.data(updatedData);
        heat.draw();
        console.log(updatedData);
        console.log(getRandomPoints(50));
        
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={mapRef} style={{ backgroundImage: `url(${mapImages[props.map]})`, backgroundSize: "50%", backgroundRepeat: 'no-repeat' }} />
      {/* <canvas ref={heatmapRef} {...props} width="100%" height="100%" /> */}
    </div>
  );
}

function getRandomPoints(amount: number) {
  const points = [];
  for (let i = 0; i < amount; i++) {
    points.push([Math.random() * 500, Math.random() * 500, 1]);
    // [[x, y , opacity], [x, y , opacity]]
  }
  return points;
}

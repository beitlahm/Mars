# Mars map assets

| File | Data product |
| --- | --- |
| `arcadia-optical.jpg` | HiRISE orthorectified red band image ESP_035651_2210_RED_C_01_ORTHO, resampled for display. |
| `arcadia-terrain.json`, `arcadia-elevation.png` | HiRISE stereo DTM DTEEC_035651_2210_036917_2210_A01, reduced to approximately 20 m sample spacing for the demo. Elevations use the Mars 2000 datum. |
| `arcadia-thermal.jpg` | Mars Trek THEMIS daytime IR mosaic, assembled from level 9 tiles for local comparison. |
| `mars-global.jpg` | NASA Viking MDIM color mosaic for global context. |

HiRISE data credit goes to NASA/JPL-Caltech/UArizona. The [HiRISE product page](https://www.uahirise.org/dtm/ESP_035651_2210) provides the source image, terrain product and labels. Thermal and global map context come from [NASA Mars Trek](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars).

The app displays the terrain as relative relief on a Mars sphere. The route profile reports the source elevation datum. Thermal IR image brightness provides context for comparison. The interface does not infer current surface temperatures from it.

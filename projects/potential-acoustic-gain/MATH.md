# Potential Acoustic Gain — Math Reference

All math used in the explorable explanation, with sources and assumptions.

## 1. Geometric PAG (no directivity)

Source: JBL *Sound System Design Reference Manual* (Augspurger / Eargle), Chapter 4.

Four distances measured between point-locations of the four components:

- **D_S**: talker → microphone
- **D_1**: microphone → loudspeaker
- **D_2**: loudspeaker → listener
- **D_0**: talker → listener

PAG in dB:

$$
\mathrm{PAG} = 20 \log_{10}\!\left[\frac{D_1}{D_S} \cdot \frac{D_0}{D_2}\right]
$$

This is the "no margin" form. The textbook formula subtracts 6 dB as a stability safety margin:

$$
\mathrm{PAG}_{\text{safe}} = 20 \log_{10}\!\left[\frac{D_1}{D_S} \cdot \frac{D_0}{D_2}\right] - 6
$$

We use the unmarginned form to match the canonical Digital Sound & Music demo.

**Derivation:** Feedback occurs when the loudspeaker delivers sound at the microphone at the same SPL as the talker. Assuming free-field propagation (inverse-square law), the talker produces SPL at the listener of `L_talker - 20·log(D_0/D_S)`, and the loudspeaker (at the feedback threshold) produces SPL at the listener of `L_talker - 20·log(D_2/D_1)`. The gain is the difference:

$$
\mathrm{Gain} = -20 \log\!\frac{D_2}{D_1} + 20 \log\!\frac{D_0}{D_S} = 20 \log\!\frac{D_1 \cdot D_0}{D_S \cdot D_2}
$$

Note: the talker's SPL cancels out — PAG is independent of how loud the source is.

## 2. Microphone directivity correction

Standard polar patterns (frequency-independent, idealized):

| Pattern | Polar response D(θ) | Null position |
|---|---|---|
| Omnidirectional | D(θ) = 1 | (none) |
| Cardioid | D(θ) = ½(1 + cos θ) | 180° |
| Supercardioid | D(θ) = 0.37 + 0.63 cos θ | ≈126° |
| Hypercardioid | D(θ) = 0.25 + 0.75 cos θ | ≈109.5° |

θ = 0 is on-axis (pointed at the talker). We treat the microphone's on-axis direction as the vector from mic to talker.

**Off-axis angle (mic side):**

$$
\theta_{\text{mic}} = \arccos\!\left(\frac{\vec{v}_{\text{mic→talker}} \cdot \vec{v}_{\text{mic→speaker}}}{|\vec{v}_{\text{mic→talker}}| \cdot |\vec{v}_{\text{mic→speaker}}|}\right)
$$

**Correction in dB:**

$$
\Delta_{\text{mic}} = -20 \log_{10}\!\left(\max(|D(\theta_{\text{mic}})|, \, 10^{-25/20})\right)
$$

The 25 dB cap models the fact that real microphones don't achieve infinite rejection at the polar null (due to frequency-dependent pattern broadening, manufacturing tolerances, and capsule diaphragm geometry).

## 3. Loudspeaker directivity correction

Empirical piecewise model (calibrated to reproduce the canonical Digital Sound & Music demo's displayed correction values):

**Inside the beam** (|θ| ≤ BW/2): cosine-power lobe, calibrated so D(BW/2) = ½ (i.e., -6 dB at the half-beamwidth edge).

$$
n = \frac{\log(0.5)}{\log\!\cos(\mathrm{BW}/4)}
$$

$$
D(\theta) = \cos^n(\theta/2) \quad \text{for } |\theta| \le \mathrm{BW}/2
$$

For our three patterns:

| Beamwidth | n |
|---|---|
| 90° | 8.755 |
| 60° | 19.994 |
| 40° | 45.278 |

**Outside the beam** (|θ| > BW/2): linear-in-dB falloff continuing from the 6 dB edge attenuation.

$$
\Delta_{\text{spk}}(\theta) = 6 + 0.27 \cdot (|\theta| - \mathrm{BW}/2) \quad [\text{degrees, dB}]
$$

The 0.27 dB/degree slope was reverse-engineered from the original demo's screenshots — 90° pattern at 107.4° off-axis produces 22.8 dB correction; 60° at the same angle produces 26.4 dB.

**Off-axis angle (speaker side):**

$$
\theta_{\text{spk}} = \arccos\!\left(\frac{\vec{v}_{\text{spk→listener}} \cdot \vec{v}_{\text{spk→mic}}}{|\vec{v}_{\text{spk→listener}}| \cdot |\vec{v}_{\text{spk→mic}}|}\right)
$$

The loudspeaker's on-axis direction is the vector from speaker to listener (i.e., we assume the speaker is always aimed at the listener — visualized by the speaker icon rotating to face the listener).

### Why not cosine-power everywhere?

A pure cosine-power model gives ~40 dB at 107° off-axis for a 90° speaker. Real loudspeakers don't behave that way at far off-axis angles — they have side and rear lobes that produce roughly linear-in-dB attenuation rather than the steep falloff predicted by raising cosine to a high power. The piecewise model captures the textbook "main lobe with -6 dB edges" behavior inside the beam and a more realistic side/rear attenuation outside.

### Caveat

The loudspeaker correction is "estimated for demonstrative purposes only" (per the canonical demo's slide text). Real loudspeaker directivity is strongly frequency-dependent — at low frequencies most loudspeakers are nearly omnidirectional, so the displayed correction is closest to truth at midrange and high frequencies.

## 4. Composite PAG with directivity

$$
\mathrm{PAG}_{\text{total}} = 20 \log_{10}\!\left[\frac{D_1}{D_S} \cdot \frac{D_0}{D_2}\right] + \Delta_{\text{mic}} + \Delta_{\text{spk}}
$$

## 5. Scene-to-physical unit conversion

The SVG canvas uses pixels; we display feet/inches.

$$
\text{PX\_PER\_FT} = 13
$$

(So 1 ft = 13 px, and 49'5" ≈ 642 px on the floor.)

Baseline geometry used for slides 4–8 (matches the canonical demo):

| Point | Scene coords (px) | Notes |
|---|---|---|
| Talker | (80, 318) | Mouth at y; figure stands to y=386 (floor) |
| Microphone | (172, 322) | Capsule at y; stand to y=386 |
| Loudspeaker | (390, 126) or (234, 218) | Flown; baseline differs by slide |
| Listener | (722, 334) | Ear at y; figure seated to y=386 |

Resulting distances: D_S = 7'1", D_1 varies, D_2 varies, D_0 = 49'5".

## 6. References

- Augspurger, G. and Eargle, J. *Sound System Design Reference Manual*. JBL Professional, 1999. Chapter 4.
- Romney, J. and Hosken, D. *Digital Sound and Music*. Free online at digitalsoundandmusic.com. Chapter 4.2.2 "Acoustic Considerations for Live Performances".
- Lively, N. interview with Romney, J. "Why EQ Is Not the Answer to Microphone Feedback". Live Sound Summit (transcribed).
- Shure Inc. *MXA910 for Voice Lift Applications*. Technical document, 2019. (Modified PAG with directivity bonus for ceiling array microphones.)

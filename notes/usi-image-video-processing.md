# Point Operations

Course-related notes for **USI image and video processing** assignments.

## Tonemapping & Linearization

![A1 1.1](../A1%201.1.png)

Display signals are gamma-encoded: $V_{encoded} = V_{linear}^{1/\gamma}$, so the stored pixel values are not linear. To perform mathematically correct operations, the encoded values must first be linearized:

$$V_{linear} = V_{encoded}^{\gamma}$$

**Brightness** applies a linear scale to the linearized signal:

$$y = brightness \times x$$

A larger brightness factor shifts all intensities upward uniformly.

**Contrast** applies a power-law curve:

$$y = x^{\alpha}$$

- When $\alpha < 1$, the curve bows upward — dark regions brighten more than bright regions, reducing perceived contrast and making the image appear grayer and flatter.
- When $\alpha > 1$, the curve bows downward — bright regions are compressed and dark regions are pushed further toward black, increasing perceived contrast.

## Color Correction

![A1 1.2](../A1%201.2.png)

**Gray World**

The assumption is that the average color of a natural scene is neutral gray. Channel-wise means $\mu_R, \mu_G, \mu_B$ are computed, then each channel is scaled so all three means converge to the same target gray $\mu$:

$$\mu = \frac{\mu_R + \mu_G + \mu_B}{3}, \qquad g_c = \frac{\mu}{\mu_c} \quad (c \in \{R, G, B\})$$

**Pixel-Based (White Patch)**

The brightest pixels in the scene — typically the top 1% by luminance — are assumed to be the reference white. Their per-channel averages $\bar{R}, \bar{G}, \bar{B}$ are computed, and each channel is scaled so this reference maps to $[255, 255, 255]$:

$$g_c = \frac{255}{\bar{c}} \quad (c \in \{R, G, B\})$$

## Histogram Equalization

![A1 1.3-1.4](../A1%201.3-1.4.png)

**Global** equalization maps the entire image's intensity distribution to a uniform spread over $[0, 255]$ via the cumulative distribution function (CDF). The remapped histogram is approximately flat, and overall brightness improves. However, previously adjacent gray levels can be pulled apart, turning what was a smooth gradient into visible intensity gaps — the source of discontinuous banding in uniform regions.

**Local (block-based)** equalization applies the same CDF stretching independently to each non-overlapping grid cell. This adapts to local contrast, and the per-block histogram becomes very uniform. The drawback is that the mapping function is discontinuous at block boundaries, producing visible blocky artifacts and an unnatural appearance at the seams.

**Locally adaptive (sliding-window)** equalization computes the equalization mapping for each pixel from the statistics of its surrounding $N \times N$ neighbourhood. The histogram is approximately uniform at every local point, eliminating the block-boundary discontinuities of the local method. Additionally, histogram clipping caps excessively tall peaks and redistributes the excess counts evenly across all gray levels, limiting noise amplification in near-uniform regions.

Because applying a full sliding window to the original $6000 \times 4000$ image would be prohibitively slow, the resolution is downsampled to $300 \times 200$ before processing. The window size controls the strength of enhancement: a smaller window makes each pixel's mapping depend on a very tight neighbourhood, producing more dramatic local contrast. A larger window approaches global behaviour and yields a flatter, more even distribution.

## Matting

![A1 1.5](../A1%201.5.png)

A binary green-screen mask is constructed from the foreground image. A pixel is classified as green-screen if:

$$G > 1.1 \times R \quad \text{and} \quad G > 1.1 \times B \quad \text{and} \quad G > 50$$

The first two conditions require the green channel to be at least 10% stronger than both the red and blue channels. The third condition excludes very dark pixels, where noise could otherwise produce spurious green classifications.

The composite is then assembled per-pixel: background pixels fill regions where the mask is true; original foreground pixels are retained everywhere else.

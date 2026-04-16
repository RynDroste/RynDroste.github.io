# Spheres with Phong lighting model

Course-related notes for **USI computer graphics** works.

## 1. Scene Initialization

The rendering pipeline begins by constructing the virtual world:

- **Camera and canvas:** The image resolution and the camera's field of view (FOV) determine the mapping from pixels to rays. A wider FOV compresses more of the scene into the same pixel grid.
- **Geometry:** Objects such as spheres are placed in the scene by specifying their center positions and radii.
- **Materials and lights:** Each object is bound to a material described by ambient, diffuse, and specular coefficients, plus a shininess exponent. Point lights are positioned in the scene to illuminate surfaces.

## 2. Ray Generation

Ray tracing works by casting one ray per pixel from the camera through the virtual screen.

- **Screen-to-world mapping:** The pixel grid is mapped to physical world coordinates. Each pixel $(i, j)$ corresponds to a point on a virtual screen plane at a fixed depth $Z = 1$, with the camera at the origin $(0, 0, 0)$.
- **Ray direction:** The direction vector $\vec{d}$ from the camera through pixel $(i, j)$ is computed from the screen coordinates and then normalized: $\hat{d} = \vec{d} / |\vec{d}|$.
- **Ray:** A ray is defined by its origin $\mathbf{o}$ and direction $\hat{d}$, and parameterized as $\mathbf{p}(t) = \mathbf{o} + t\,\hat{d}$ for $t > 0$.

## 3. Ray–Sphere Intersection

To find what a ray hits, it is tested against every object in the scene. For a sphere of center $\mathbf{c}$ and radius $r$:

- Compute $\vec{OC} = \mathbf{c} - \mathbf{o}$, the vector from the ray origin to the sphere center.
- Project $\vec{OC}$ onto the ray direction: $a = \vec{OC} \cdot \hat{d}$.
- Compute the perpendicular distance from the center to the ray: $D = \sqrt{|\vec{OC}|^2 - a^2}$.
- If $D \le r$, the ray intersects the sphere. The intersection parameter is $t = a - \sqrt{r^2 - D^2}$, giving the hit point $\mathbf{p} = \mathbf{o} + t\,\hat{d}$ and the outward normal $\hat{n} = (\mathbf{p} - \mathbf{c}) / r$.
- Among all objects hit with $t > 0$, only the closest intersection (smallest $t$) is kept, since nearer objects occlude those behind them.

## 4. Shading — Phong Lighting Model

The color of a hit point is computed by summing three lighting components:

- **Ambient:** A constant base illumination that prevents surfaces from being completely black in shadow.
$$I_{\text{ambient}} = K_a \times I_{\text{ambient light}}$$

- **Diffuse:** Models matte scattering. Brightness depends on the cosine of the angle between the surface normal $\hat{n}$ and the light direction $\hat{l}$, capturing Lambert's cosine law.
$$I_{\text{diffuse}} = K_d \times I_{\text{light}} \times \max(\hat{n} \cdot \hat{l},\ 0)$$

- **Specular:** Models mirror-like highlights. The intensity depends on the angle between the reflected ray $\hat{r}$ and the view direction $\hat{v}$, raised to the shininess exponent to control highlight sharpness.
$$I_{\text{specular}} = K_s \times I_{\text{light}} \times \max(\hat{v} \cdot \hat{r},\ 0)^{\text{shininess}}$$

The final color is the sum of all three components, clamped to $[0.0,\ 1.0]$.

# Transformations & Tone Mapping

## I. Geometric Transformations

In 3D graphics, objects are defined in their own **local coordinate system** and placed into the world via a **model matrix** $M$.

- **Model matrix $M$:** Transforms a point from local space to world space. Built by composing translation, rotation, and scale.
- **Inverse matrix $M^{-1}$:** Instead of transforming every point of a complex object, rays can be transformed into the object's local space using $M^{-1}$, where the intersection test is simpler.
- **Normal matrix:** Surface normals cannot be transformed by $M$ directly — non-uniform scaling would break their perpendicularity to the surface. The correct transform is the **transpose of the inverse**: $(M^{-1})^T$.

## II. Tone Mapping

Ray-traced radiance values are physically unbounded. Point lights with inverse-square attenuation ($1/r^2$) and multiple reflections produce HDR values far above $1.0$, which standard displays cannot represent.

Tone mapping compresses this high dynamic range into $[0, 1]$ via a power-law curve that combines exposure and gamma:

$$C_{\text{out}} = \text{clamp}\!\left(\alpha \cdot C_{\text{in}}^{\,\gamma},\ 0,\ 1\right)$$

- **Gamma** ($\gamma < 1$, e.g. $0.5$): Applying $C_{\text{in}}^{0.5}$ (square root) redistributes intensity toward brighter values, compensating for the human eye's greater sensitivity to changes in dark regions and preventing shadows from appearing crushed.
- **Exposure** ($\alpha > 1$, e.g. $12.0$): Scales the overall brightness, analogous to adjusting a camera's ISO or shutter speed, to bring weakly lit scenes into a visible range.
- **Clamping:** Ensures no channel exceeds $1.0$, preventing color overflow in the output image.

Together these steps convert physically based radiance into perceptually pleasing, display-ready color values.

# Meshes

## 1. OBJ File Format

An OBJ file stores 3D geometry as plain text records:

- **Vertex positions** (`v`): 3D coordinates $(x, y, z)$ of each point.
- **Vertex normals** (`vn`): A precomputed or artist-defined unit normal per vertex.
- **Faces** (`f`): Polygonal faces defined by indices into the vertex (and optionally normal) lists. A triangulated OBJ face references three vertices; formats such as `v//vn` or `v/vt/vn` encode additional per-vertex attributes.

Parsing reads these records into arrays of positions and normals, with face entries stored as index triples that reference them.

## 2. Mesh Construction — From Raw Data to Scene Objects

After parsing, the raw index arrays are turned into geometric primitives:

- **Spatial placement:** Each vertex is transformed from the model's local coordinate system into world space by applying a translation offset. This positions the mesh at its intended location in the scene.
- **Triangle splitting:** Each face entry yields one triangle by extracting three vertex positions (and, when present, three vertex normals) from the parsed arrays.
- **Assembly:** The mesh stores its triangles as an array of independent triangle primitives, each carrying the material assigned to the mesh.

## 3. Ray–Triangle Intersection (Möller–Trumbore)

To test a ray $\mathbf{p}(t) = \mathbf{o} + t\,\hat{d}$ against a triangle with vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2$, the Möller–Trumbore algorithm solves for $(t, u, v)$ directly without computing a plane equation first.

Define edge vectors $\mathbf{e}_1 = \mathbf{v}_1 - \mathbf{v}_0$ and $\mathbf{e}_2 = \mathbf{v}_2 - \mathbf{v}_0$, and let $\mathbf{h} = \hat{d} \times \mathbf{e}_2$. The system to solve is:

$$\begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\mathbf{h} \cdot \mathbf{e}_1} \begin{bmatrix} (\mathbf{o} - \mathbf{v}_0) \cdot (\hat{d} \times \mathbf{e}_2) \\ \hat{d} \cdot ((\mathbf{o} - \mathbf{v}_0) \times \mathbf{e}_1) \\ \mathbf{h} \cdot (\mathbf{o} - \mathbf{v}_0) \end{bmatrix}$$

The intersection is valid when $t > 0$, $u \ge 0$, $v \ge 0$, and $u + v \le 1$. The third barycentric coordinate is $w = 1 - u - v$.

## 4. Barycentric Normal Interpolation (Phong Shading)

When vertex normals $\hat{n}_0, \hat{n}_1, \hat{n}_2$ are available, the surface normal at the hit point is interpolated using the barycentric coordinates $(w, u, v)$:

$$\hat{n}_{\text{hit}} = \text{normalize}(w\,\hat{n}_0 + u\,\hat{n}_1 + v\,\hat{n}_2)$$

This produces a smoothly varying normal across the triangle's surface even though the geometry is flat. The resulting shading appears curved — this is the principle behind **Phong shading** (distinct from the Phong lighting model).

## 5. Intersection Complexity and Acceleration

A mesh with $N$ triangles requires testing every ray against all $N$ triangles in the worst case, giving $O(N)$ complexity per ray. For dense models (tens or hundreds of thousands of faces) this becomes the dominant bottleneck.

The standard remedy is a **spatial acceleration structure** that partitions triangles in 3D space so most can be skipped without testing:

- **BVH (Bounding Volume Hierarchy):** Recursively groups triangles into nested bounding boxes. A ray that misses a parent box skips the entire subtree, reducing average complexity to $O(\log N)$.
- **KD-Tree:** Partitions space with axis-aligned splitting planes, achieving similar asymptotic gains with different constant factors.

# Spatial Data Structures

## 1. Motivation

Without a spatial structure, each ray must be tested against every triangle in the scene — $O(N)$ per ray. For meshes with tens or hundreds of thousands of faces this becomes the dominant bottleneck. A **Bounding Volume Hierarchy (BVH)** wraps groups of primitives in simple enclosing volumes and organises them into a binary tree, reducing average intersection cost to $O(\log N)$.

Unlike grids or octrees, which partition *space*, BVH partitions the set of *objects*: every primitive belongs to exactly one leaf node regardless of its size or position.

## 2. Construction

BVH construction recursively splits the primitive set into two subsets and wraps each in an **Axis-Aligned Bounding Box (AABB)**:

1. **Compute centroids.** For each triangle, compute its centroid and its AABB. Merge all AABBs into a single bounding box for the full set, and a separate centroid-bounding box.
2. **Choose split axis.** Select the axis ($x$, $y$, or $z$) along which the centroid bounding box has the greatest extent. Splitting along the longest axis tends to produce balanced, compact subtrees.
3. **Partition.** Find the midpoint $p_{\text{mid}}$ of the centroid bounding box along that axis. Assign triangles whose centroid falls below $p_{\text{mid}}$ to the left child and the rest to the right child.
4. **Recurse.** Apply the same procedure to each child set. A node becomes a **leaf** when it contains a single primitive or all centroids are coincident.

## 3. Memory Layout — Flattening for Cache Locality

A pointer-based binary tree scatters nodes across the heap, causing frequent cache misses during traversal. The standard remedy is to **linearise** the tree into a contiguous array in depth-first order.

In this flat layout, each node stores its bounding box, the offset to its second child (the first child is always the next element), and — for leaf nodes — the range of primitives it covers. This compact, sequential memory layout maximises CPU cache utilisation during the high-frequency traversal step.

## 4. Traversal

Ray–BVH traversal uses an explicit stack rather than recursion to avoid function-call overhead:

1. **AABB slab test.** For each node, compute whether the ray intersects its bounding box. The slab method tests the ray against three pairs of parallel planes (one pair per axis) and checks whether the intervals of entry and exit overlap. If the ray misses the box, the entire subtree is skipped.
2. **Front-to-back ordering.** The sign of the ray's direction component along the split axis determines which child is nearer. Visiting the nearer child first allows the algorithm to find a close hit sooner, which tightens the upper bound $t_{\text{max}}$ and allows more distant subtrees to be culled immediately.
3. **Dynamic $t_{\text{max}}$ pruning.** Once a leaf intersection is found at distance $t_{\text{hit}}$, $t_{\text{max}}$ is updated to $t_{\text{hit}}$. Any bounding box whose near intersection distance exceeds the current $t_{\text{max}}$ is pruned without visiting its contents, because a closer hit has already been recorded.

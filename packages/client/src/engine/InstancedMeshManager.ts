import * as THREE from 'three'

interface Block {
  position: THREE.Vector3
  type: string
}

interface InstancedMeshData {
  mesh: THREE.InstancedMesh
  count: number
  blocks: Map<string, Block>
}

export class InstancedMeshManager {
  private blockTypes: Map<string, InstancedMeshData> = new Map()
  private maxBlocks: number
  private totalBlocks: number = 0
  private positionKey = (pos: THREE.Vector3) => `${pos.x},${pos.y},${pos.z}`

  constructor(maxBlocks: number = 100000) {
    this.maxBlocks = maxBlocks
    console.log(`InstancedMeshManager: max ${maxBlocks} blocks`)
  }

  /**
   * Добавить блок
   */
  public addBlock(position: THREE.Vector3, blockType: string = 'default'): void {
    const key = this.positionKey(position)

    if (!this.blockTypes.has(blockType)) {
      this.createBlockType(blockType)
    }

    const data = this.blockTypes.get(blockType)!
    const block: Block = {
      position: position.clone(),
      type: blockType,
    }

    data.blocks.set(key, block)
    this.totalBlocks++

    // Обновляем матрицу трансформации
    const matrix = new THREE.Matrix4()
    matrix.setPosition(position)
    data.mesh.setMatrixAt(data.count, matrix)
    data.mesh.instanceMatrix.needsUpdate = true
    data.count++
  }

  /**
   * Удалить блок
   */
  public removeBlock(position: THREE.Vector3): void {
    const key = this.positionKey(position)

    for (const [, data] of this.blockTypes) {
      if (data.blocks.has(key)) {
        data.blocks.delete(key)
        this.totalBlocks--
        break
      }
    }
  }

  /**
   * Получить блок
   */
  public getBlock(position: THREE.Vector3): string | null {
    const key = this.positionKey(position)

    for (const [blockType, data] of this.blockTypes) {
      if (data.blocks.has(key)) {
        return blockType
      }
    }

    return null
  }

  /**
   * Создать тип блока с InstancedMesh
   */
  private createBlockType(blockType: string): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: this.getColorForBlockType(blockType),
    })

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.maxBlocks
    )
    instancedMesh.castShadow = true
    instancedMesh.receiveShadow = true

    this.blockTypes.set(blockType, {
      mesh: instancedMesh,
      count: 0,
      blocks: new Map(),
    })
  }

  /**
   * Получить цвет для типа блока
   */
  private getColorForBlockType(blockType: string): number {
    const colors: Record<string, number> = {
      'default': 0x8B7355,  // коричневый
      'stone': 0x808080,    // серый
      'grass': 0x2d5016,    // зелёный
      'water': 0x4169E1,    // голубой
      'sand': 0xF4A460,     // песочный
    }
    return colors[blockType] || 0xFFFFFF
  }

  /**
   * Обновить мировые матрицы
   */
  public update(scene: THREE.Scene): void {
    for (const [, data] of this.blockTypes) {
      if (!scene.getObjectById(data.mesh.id)) {
        scene.add(data.mesh)
      }
    }
  }

  /**
   * Получить количество блоков
   */
  public getBlockCount(): number {
    return this.totalBlocks
  }

  /**
   * Очистить ресурсы
   */
  public dispose(): void {
    for (const [, data] of this.blockTypes) {
      data.mesh.geometry.dispose()
      if (Array.isArray(data.mesh.material)) {
        data.mesh.material.forEach(m => m.dispose())
      } else {
        data.mesh.material.dispose()
      }
    }
    this.blockTypes.clear()
  }
}
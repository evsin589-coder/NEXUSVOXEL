import * as CANNON from 'cannon-es'

export class PhysicsManager {
  private world: CANNON.World
  private bodies: CANNON.Body[] = []
  private gravity: CANNON.Vec3

  constructor(gravity: number = -9.82) {
    this.world = new CANNON.World()
    this.gravity = new CANNON.Vec3(0, gravity, 0)
    this.world.gravity.copy(this.gravity)

    // Настройки физики для лучшей производительности
    this.world.defaultContactMaterial.friction = 0.3
    this.world.defaultContactMaterial.restitution = 0.3
    this.world.solver.iterations = 3

    console.log('PhysicsManager initialized')
  }

  /**
   * Добавить тело в физический мир
   */
  public addBody(body: CANNON.Body): void {
    this.world.addBody(body)
    this.bodies.push(body)
  }

  /**
   * Удалить тело
   */
  public removeBody(body: CANNON.Body): void {
    this.world.removeBody(body)
    this.bodies = this.bodies.filter(b => b !== body)
  }

  /**
   * Получить физический мир
   */
  public getWorld(): CANNON.World {
    return this.world
  }

  /**
   * Обновить физику
   */
  public update(delta: number): void {
    this.world.step(1 / 60, delta, 3)
  }

  /**
   * Raycast для проверки столкновений
   */
  public raycast(
    from: CANNON.Vec3,
    to: CANNON.Vec3
  ): CANNON.RaycastResult | null {
    const result = new CANNON.RaycastResult()
    this.world.raycastClosest(from, to, {}, result)
    return result.hasHit ? result : null
  }

  /**
   * Получить количество тел
   */
  public getBodyCount(): number {
    return this.bodies.length
  }

  /**
   * Очистить ресурсы
   */
  public dispose(): void {
    this.bodies.forEach(body => this.world.removeBody(body))
    this.bodies = []
  }
}
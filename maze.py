import random
import sys

# Increase recursion depth for larger mazes if needed, but default should be fine for this size
sys.setrecursionlimit(2000)

def generate_maze(width, height):
    # Dimensions should be odd for walls and paths to align properly
    if width % 2 == 0: width += 1
    if height % 2 == 0: height += 1

    # Initialize maze with walls ('#')
    maze = [['#' for _ in range(width)] for _ in range(height)]
    
    # Directions: (dx, dy) for moving 2 steps at a time
    directions = [(0, -2), (0, 2), (-2, 0), (2, 0)]

    def carve_passages_from(cx, cy):
        # Mark current cell as path (' ')
        maze[cy][cx] = ' '
        
        # Shuffle directions for random paths
        random.shuffle(directions)

        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy
            
            # Check if next cell is within bounds and is a wall
            if 0 < nx < width - 1 and 0 < ny < height - 1 and maze[ny][nx] == '#':
                # Carve the wall between current cell and next cell
                maze[cy + dy//2][cx + dx//2] = ' '
                carve_passages_from(nx, ny)

    # Start carving from (1, 1)
    carve_passages_from(1, 1)
    
    # Set entrance (S) and exit (E)
    maze[1][0] = 'S'
    maze[height-2][width-1] = 'E'

    return maze

def print_maze(maze):
    for row in maze:
        print(' '.join(row))

if __name__ == '__main__':
    width, height = 31, 15
    print(f"Generating a {width}x{height} maze:\n")
    maze = generate_maze(width, height)
    print_maze(maze)

import tkinter as tk
from tkinter import ttk
from collections import deque
import heapq
import time

ROWS = 20
COLS = 20
CELL = 30

grid = [[0]*COLS for _ in range(ROWS)]

start_node = (0, 0)
goal_node = (ROWS-1, COLS-1)

root = tk.Tk()
root.title("AI Maze Pathfinder")

canvas = tk.Canvas(root, width=COLS*CELL, height=ROWS*CELL)
canvas.pack()

algo = tk.StringVar(value="BFS")

visited_nodes = 0


def draw():
    canvas.delete("all")

    for r in range(ROWS):
        for c in range(COLS):

            color = "white"

            if grid[r][c] == 1:
                color = "black"

            if (r, c) == start_node:
                color = "green"

            if (r, c) == goal_node:
                color = "red"

            canvas.create_rectangle(
                c*CELL,
                r*CELL,
                c*CELL+CELL,
                r*CELL+CELL,
                fill=color,
                outline="gray"
            )


def click(event):
    global start_node, goal_node

    c = event.x // CELL
    r = event.y // CELL

    if r >= ROWS or c >= COLS:
        return

    if event.state & 0x0001:
        start_node = (r, c)

    elif event.state & 0x0004:
        goal_node = (r, c)

    else:
        grid[r][c] = 1 - grid[r][c]

    draw()


canvas.bind("<Button-1>", click)


def neighbors(r, c):
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    for dr, dc in dirs:
        nr = r + dr
        nc = c + dc

        if 0 <= nr < ROWS and 0 <= nc < COLS and grid[nr][nc] == 0:
            yield (nr, nc)


def reconstruct(parent, end):
    while end in parent:
        r, c = end

        canvas.create_rectangle(
            c*CELL, r*CELL,
            c*CELL+CELL, r*CELL+CELL,
            fill="yellow"
        )

        root.update()
        time.sleep(0.02)

        end = parent[end]


def bfs():
    global visited_nodes
    visited_nodes = 0

    q = deque([start_node])
    visited = set([start_node])
    parent = {}

    while q:
        r, c = q.popleft()
        visited_nodes += 1

        if (r, c) == goal_node:
            reconstruct(parent, goal_node)
            return

        for nr, nc in neighbors(r, c):
            if (nr, nc) not in visited:
                visited.add((nr, nc))
                parent[(nr, nc)] = (r, c)

                canvas.create_rectangle(
                    nc*CELL, nr*CELL,
                    nc*CELL+CELL, nr*CELL+CELL,
                    fill="blue"
                )

                root.update()
                time.sleep(0.01)

                q.append((nr, nc))


def dfs():
    global visited_nodes
    visited_nodes = 0

    stack = [start_node]
    visited = set([start_node])
    parent = {}

    while stack:
        r, c = stack.pop()
        visited_nodes += 1

        if (r, c) == goal_node:
            reconstruct(parent, goal_node)
            return

        for nr, nc in neighbors(r, c):
            if (nr, nc) not in visited:
                visited.add((nr, nc))
                parent[(nr, nc)] = (r, c)

                canvas.create_rectangle(
                    nc*CELL, nr*CELL,
                    nc*CELL+CELL, nr*CELL+CELL,
                    fill="blue"
                )

                root.update()
                time.sleep(0.01)

                stack.append((nr, nc))


def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def astar():
    global visited_nodes
    visited_nodes = 0

    pq = []
    heapq.heappush(pq, (0, start_node))

    parent = {}
    g = {start_node: 0}

    while pq:
        _, current = heapq.heappop(pq)
        visited_nodes += 1

        if current == goal_node:
            reconstruct(parent, goal_node)
            return

        r, c = current

        for nr, nc in neighbors(r, c):
            new_cost = g[current] + 1

            if (nr, nc) not in g or new_cost < g[(nr, nc)]:
                g[(nr, nc)] = new_cost
                f = new_cost + heuristic((nr, nc), goal_node)

                heapq.heappush(pq, (f, (nr, nc)))
                parent[(nr, nc)] = (r, c)

                canvas.create_rectangle(
                    nc*CELL, nr*CELL,
                    nc*CELL+CELL, nr*CELL+CELL,
                    fill="blue"
                )

                root.update()
                time.sleep(0.01)



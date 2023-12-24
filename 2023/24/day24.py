
from sympy import symbols, solve

with open('input.txt') as file:
    lines = [line for line in file]

hail = []
for line in lines:
    a, b = line.split(" @ ")
    p = list(map(int, a.strip().split(", ")))
    q = list(map(int, b.strip().split(", ")))
    hail.append(((p[0], p[1], p[2]), (q[0], q[1], q[2])))

x0, y0, z0, xv, yv, zv, t1, t2, t3 = symbols('x0 y0 z0 xv yv zv t1 t2 t3')
equations = []
for (p, q), t in zip(hail[:3], [t1, t2, t3]):
    equations.append(p[0] + q[0]*t - (x0 + xv*t))
    equations.append(p[1] + q[1]*t - (y0 + yv*t))
    equations.append(p[2] + q[2]*t - (z0 + zv*t))

res = solve(equations, x0, y0, z0, xv, yv, zv, t1, t2, t3, dict=True)[0]
print(res[x0] + res[y0] + res[z0])

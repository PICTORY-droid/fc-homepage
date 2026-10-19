"""명함 아이콘 — 직접 그린 단순 기하 도형(저작권 걱정 없는 오리지널). 지역 좌표 -50~50 안에서 그리고 크기·위치로 옮겨 씁니다."""
import math

from scene import ellipse, line, move, poly, rect, scale_about


def arc_pts(cx, cy, rx, ry, a0, a1, n=14):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def rot_pts(pts, deg, ox=0, oy=0):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return [(ox + (x - ox) * c - (y - oy) * s, oy + (x - ox) * s + (y - oy) * c) for x, y in pts]


def _cup(a, b):
    return [poly([(-30, -10), (30, -10), (24, 34), (-24, 34)], a), ellipse(36, 8, 14, 14, None, a, 6), rect(-42, 36, 84, 7, b, r=3),
            line(-10, -20, -6, -36, b, 5), line(8, -20, 12, -36, b, 5)]


def _bowl(a, b):
    return [poly(arc_pts(0, 0, 40, 34, 0, 180), a), rect(-26, 33, 52, 7, b, r=3), line(-6, -34, 30, -4, b, 5), line(6, -34, 40, -8, b, 5)]


def _leaf(a, b):
    return [ellipse(0, 0, 22, 42, a, rot=38), line(-26, 30, 24, -30, b, 4)]


def _flower(a, b):
    return [ellipse(math.cos(math.radians(t - 90)) * 24, math.sin(math.radians(t - 90)) * 24, 13, 22, a, rot=t) for t in range(0, 360, 72)] + [ellipse(0, 0, 11, 11, b)]


def _scissors(a, b):
    return [ellipse(-22, 28, 13, 13, None, a, 6), ellipse(22, 28, 13, 13, None, a, 6), line(-14, 18, 24, -42, b, 7), line(14, 18, -24, -42, a, 7)]


def _mirror(a, b):
    return [ellipse(0, -10, 28, 32, None, a, 8), ellipse(0, -10, 19, 23, b, op=0.35), rect(-5, 20, 10, 30, a, r=5)]


def _lipstick(a, b):
    return [rect(-16, 0, 32, 46, a, r=3), rect(-12, -22, 24, 24, b), poly([(-12, -22), (12, -22), (12, -42), (-12, -32)], b)]


def _book(a, b):
    return [poly([(-46, -28), (-2, -20), (-2, 36), (-46, 28)], a), poly([(46, -28), (2, -20), (2, 36), (46, 28)], b)]


def _pencil(a, b):
    body = rot_pts([(-10, -40), (10, -40), (10, 22), (-10, 22)], 40)
    tip = rot_pts([(-10, 22), (10, 22), (0, 44)], 40)
    cap = rot_pts([(-10, -50), (10, -50), (10, -40), (-10, -40)], 40)
    return [poly(body, a), poly(tip, b), poly(cap, b)]


def _house(a, b):
    return [poly([(-46, 0), (0, -42), (46, 0)], a), rect(-32, 0, 64, 42, b), rect(-8, 14, 16, 28, a)]


def _heart(a, b):
    return [ellipse(-15, -10, 19, 19, a), ellipse(15, -10, 19, 19, a), poly([(-33, -2), (33, -2), (0, 40)], a)]


def _shield(a, b):
    return [poly([(-34, -36), (0, -46), (34, -36), (34, 2), (0, 44), (-34, 2)], a), line(-14, 0, -3, 12, b, 7), line(-3, 12, 16, -12, b, 7)]


def _cross(a, b):
    return [ellipse(0, 0, 46, 46, b, op=0.35), rect(-13, -34, 26, 68, a, r=3), rect(-34, -13, 68, 26, a, r=3)]


def _code(a, b):
    return [line(-14, -26, -40, 0, a, 8), line(-40, 0, -14, 26, a, 8), line(14, -26, 40, 0, a, 8), line(40, 0, 14, 26, a, 8), line(8, -34, -8, 34, b, 7)]


def _camera(a, b):
    return [rect(-44, -20, 88, 60, a, r=10), rect(-16, -34, 32, 16, a, r=4), ellipse(0, 10, 21, 21, b), ellipse(0, 10, 11, 11, a)]


def _key(a, b):
    return [ellipse(-24, -6, 20, 20, None, a, 9), line(-6, -6, 44, -6, a, 9), line(30, -6, 30, 12, b, 8), line(44, -6, 44, 16, b, 8)]


def _star(a, b):
    pts = []
    for i in range(10):
        r = 46 if i % 2 == 0 else 19
        pts.append((r * math.cos(math.radians(-90 + i * 36)), r * math.sin(math.radians(-90 + i * 36))))
    return [poly(pts, a)]


def _sun(a, b):
    return [ellipse(0, 0, 22, 22, a)] + [line(math.cos(math.radians(t)) * 32, math.sin(math.radians(t)) * 32, math.cos(math.radians(t)) * 46, math.sin(math.radians(t)) * 46, b, 6) for t in range(0, 360, 45)]


def _bag(a, b):
    return [ellipse(0, -14, 18, 24, None, b, 7), rect(-38, -10, 76, 52, a, r=7)]


def _bulb(a, b):
    return [ellipse(0, -14, 27, 27, a), rect(-13, 12, 26, 16, b, r=3), rect(-9, 31, 18, 9, b, r=3)]


def _chart(a, b):
    return [rect(-36, 6, 20, 36, a, r=2), rect(-10, -14, 20, 56, b, r=2), rect(16, -38, 20, 80, a, r=2), line(-44, 46, 44, 46, b, 4)]


def _gear(a, b):
    return [rect(-8, -46, 16, 92, a, rot=r) for r in (0, 45, 90, 135)] + [ellipse(0, 0, 28, 28, a), ellipse(0, 0, 12, 12, b)]


def _wrench(a, b):
    return [line(-30, 32, 14, -12, a, 15), ellipse(22, -22, 20, 20, a)]


ICONS = {n[1:]: f for n, f in globals().items() if n.startswith("_") and callable(f) and n not in ("_f",) and f.__module__ == __name__}


def icon(name, cx, cy, size, c1, c2):
    """name 아이콘을 중심 (cx,cy), 지름 size 로 그린 요소 목록"""
    return scale_about(ICONS[name](c1, c2), size / 100.0, cx, cy)

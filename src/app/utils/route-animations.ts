import {
    transition,
    trigger,
    query,
    style,
    animate,
    group,
    keyframes,
    animateChild
  } from "@angular/animations";
  
  export const slideInAnimation = trigger("routeAnimations", [
    transition("Right => *", [
      query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
        optional: true
      }),
      group([
        query(
          ":enter",
          [
            style({ transform: "translateX(-100%)" }),
            animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
          ],
          { optional: true }
        ),
        query(
          ":leave",
          [
            style({ transform: "translateX(0%)" }),
            animate("0.5s ease-in-out", style({ transform: "translateX(100%)" }))
          ],
          { optional: true }
        )
      ])
    ]),
    transition("Left => *", [
      query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
        optional: true
      }),
      group([
        query(
          ":enter",
          [
            style({ transform: "translateX(100%)" }),
            animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
          ],
          { optional: true }
        ),
        query(
          ":leave",
          [
            style({ transform: "translateX(0%)" }),
            animate("0.5s ease-in-out", style({ transform: "translateX(-100%)" }))
          ],
          { optional: true }
        )
      ])
    ]),
    transition("Up => *", [
        query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
          optional: true
        }),
        group([
          query(
            ":enter",
            [
              style({ transform: "translateY(100%)" }),
              animate("0.5s ease-in-out", style({ transform: "translateY(0%)" }))
            ],
            { optional: true }
          ),
          query(
            ":leave",
            [
              style({ transform: "translateY(0%)" }),
              animate("0.5s ease-in-out", style({ transform: "translateY(-100%)" }))
            ],
            { optional: true }
          )
        ])
      ]),
      transition("Down => *", [
        query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
          optional: true
        }),
        group([
          query(
            ":enter",
            [
              style({ transform: "translateY(100%)" }),
              animate("0.5s ease-in-out", style({ transform: "translateY(0%)" }))
            ],
            { optional: true }
          ),
          query(
            ":leave",
            [
              style({ transform: "translateY(0%)" }),
              animate("0.5s ease-in-out", style({ transform: "translateY(-100%)" }))
            ],
            { optional: true }
          )
        ])
      ]),
  ]);
  
  export const fader = trigger("routeAnimations", [
    transition("* <=> *", [
      // Set a default  style for enter and leave
      query(
        ":enter, :leave",
        [
          style({
            position: "absolute",
            left: 0,
            width: "100%",
            opacity: 0,
            transform: "scale(0) translateY(100%)"
          })
        ],
        { optional: true }
      ),
      // Animate the new page in
      query(
        ":enter",
        [
          animate(
            "600ms ease",
            style({ opacity: 1, transform: "scale(1) translateY(0)" })
          )
        ],
        { optional: true }
      )
    ])
  ]);
  
  export const stepper = trigger("routeAnimations", [
    transition("* <=> *", [
      query(
        ":enter, :leave",
        [
          style({
            position: "absolute",
            left: 0,
            width: "100%"
          })
        ],
        { optional: true }
      ),
      group([
        query(
          ":enter",
          [
            animate(
              "2000ms ease",
              keyframes([
                style({ transform: "scale(0) translateX(100%)", offset: 0 }),
                style({ transform: "scale(0.5) translateX(25%)", offset: 0.3 }),
                style({ transform: "scale(1) translateX(0%)", offset: 1 })
              ])
            )
          ],
          { optional: true }
        ),
        query(
          ":leave",
          [
            animate(
              "2000ms ease",
              keyframes([
                style({ transform: "scale(1)", offset: 0 }),
                style({
                  transform: "scale(0.5) translateX(-25%) rotate(0)",
                  offset: 0.35
                }),
                style({
                  opacity: 0,
                  transform: "translateX(-50%) rotate(-180deg) scale(6)",
                  offset: 1
                })
              ])
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]);
  
<?php
add_action( 'rest_api_init', function () {
  register_rest_route( 'udssl/v1', '/timeslots/', array(
    'methods' => 'GET',
    'callback' => 'handle_udssl_api_get',
  ) );

  register_rest_route( 'udssl/v1', '/timeslots/(?P<id>\d+)?', array(
    'methods' => 'PATCH',
    'callback' => 'handle_udssl_api_patch',
  ) );
} );

function handle_udssl_api_get() {

    $timeslots = array(
      array('id' => 1, 'description' => 'Timeslot 1', 'userId' => null, 'assigned' => false ),
      array('id' => 2, 'description' => 'Timeslot 2', 'userId' => null, 'assigned' => false ),
      array('id' => 3, 'description' => 'Timeslot 3', 'userId' => null, 'assigned' => false ),
    );

    return $timeslots;
}

function handle_udssl_api_patch( $data ) {

  $id = (int) $data['id'];
  $timeslot = array('id' => $id, 'description' => 'Timeslot ' . $id, 'userId' => $id, 'assigned' => true );

  return $timeslot;
}